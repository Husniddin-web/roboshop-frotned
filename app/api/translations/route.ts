import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// GET - Read translation files
export async function GET() {
  try {
    // Updated paths to match your existing structure
    const uzPath = path.join(
      process.cwd(),
      "public/locales/uz/translation.json"
    );
    const ruPath = path.join(
      process.cwd(),
      "public/locales/ru/translation.json"
    );

    const [uzContent, ruContent] = await Promise.all([
      fs.readFile(uzPath, "utf8"),
      fs.readFile(ruPath, "utf8"),
    ]);

    const uzData = JSON.parse(uzContent);
    const ruData = JSON.parse(ruContent);

    return NextResponse.json({
      success: true,
      data: {
        uz: uzData,
        ru: ruData,
      },
    });
  } catch (error) {
    console.error("Error reading translation files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read translation files" },
      { status: 500 }
    );
  }
}

// POST - Update translation files
export async function POST(request: NextRequest) {
  try {
    const { translations } = await request.json();
    if (!translations || !translations.uz || !translations.ru) {
      return NextResponse.json(
        { success: false, error: "Invalid translation data" },
        { status: 400 }
      );
    }

    const uzPath = path.join(
      process.cwd(),
      "public/locales/uz/translation.json"
    );
    const ruPath = path.join(
      process.cwd(),
      "public/locales/ru/translation.json"
    );

    // Ensure directories exist
    await fs.mkdir(path.dirname(uzPath), { recursive: true });
    await fs.mkdir(path.dirname(ruPath), { recursive: true });

    // Write files with proper formatting
    await Promise.all([
      fs.writeFile(uzPath, JSON.stringify(translations.uz, null, 2), "utf8"),
      fs.writeFile(ruPath, JSON.stringify(translations.ru, null, 2), "utf8"),
    ]);

    return NextResponse.json({
      success: true,
      message: "Translation files updated successfully",
    });
  } catch (error) {
    console.error("Error updating translation files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update translation files" },
      { status: 500 }
    );
  }
}
