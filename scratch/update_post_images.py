import os
import glob
import re

blog_dir = "src/content/blog"
files = glob.glob(os.path.join(blog_dir, "*.md*"))

for filepath in files:
    filename = os.path.basename(filepath)
    slug = os.path.splitext(filename)[0]
    if slug == "welcome-to-encode-edge-your-path-to-practical-ai-mastery":
        image_path = "/assets/blog/welcome-to-encode-edge.svg"
    elif os.path.exists(f"public/assets/blog/{slug}.svg"):
        image_path = f"/assets/blog/{slug}.svg"
    else:
        image_path = "/assets/default-post.svg"

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # If image: is already in frontmatter, replace it, otherwise insert before authorImage:
    if re.search(r"^image:.*$", content, re.MULTILINE):
        content = re.sub(r"^image:.*$", f"image: {image_path}", content, flags=re.MULTILINE)
    else:
        # Insert before authorImage:
        content = re.sub(r"(authorImage:)", f"image: {image_path}\n\\1", content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Updated {filename} -> {image_path}")

