import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = 'edge'

// -----------------
// PUT: Update Product
// -----------------
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 })

    const supabase = await createClient()
    const body = await req.json()
    const image_urls = body.image_urls || []

    // Fetch existing images
    const { data: product } = await supabase
      .from("products")
      .select("image_url, additional_images")
      .eq("id", id)
      .single()

    // Delete removed images
    ;[product?.image_url, ...(product?.additional_images || [])]
      .filter(Boolean)
      .filter(url => !image_urls.includes(url))
      .forEach(url => {
        const pid = url?.split("/").pop()?.split(".")[0]
        if (pid) deleteFromCloudinary(pid)
      })

    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: Number(body.price),
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
      category_id: body.category_id || null,
      stock: Number(body.stock),
      is_active: !!body.is_active,
      image_url: image_urls[0] || product?.image_url,
      additional_images: image_urls.slice(1) || product?.additional_images,
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// -----------------
// DELETE: Remove Product
// -----------------
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 })

    const supabase = await createClient()
    const { data: product } = await supabase
      .from("products")
      .select("image_url, additional_images")
      .eq("id", id)
      .single()

    ;[product?.image_url, ...(product?.additional_images || [])]
      .filter(Boolean)
      .forEach(url => {
        const pid = url?.split("/").pop()?.split(".")[0]
        if (pid) deleteFromCloudinary(pid)
      })

    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

// -----------------
// Helper: Delete Cloudinary image (simple fetch)
// -----------------
async function deleteFromCloudinary(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = await sha256(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ public_id: publicId, api_key: apiKey, timestamp: timestamp.toString(), signature }).toString(),
  })
}

// -----------------
// Edge-compatible SHA256
// -----------------
async function sha256(msg: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}