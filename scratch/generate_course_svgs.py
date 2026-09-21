#!/usr/bin/env python3
import os

courses = [
    {
        "filename": "applied-deep-learning.svg",
        "title": "Applied Deep Learning",
        "subtitle": "From Neural Foundations to Production Transformers",
        "light_bg": "#F0F7FF",
        "dark_bg": "#0B1528",
        "accent": "#2563EB",
        "accent_secondary": "#38BDF8",
        "border": "#BAE6FD",
        "badge_bg": "#E0F2FE",
        "badge_text": "#0369A1",
        "category": "DEEP LEARNING",
        "diagram": """
        <!-- Neural Net Network Architecture -->
        <g transform="translate(480, 70)">
            <!-- Layer 1 -->
            <circle cx="40" cy="50" r="16" fill="#2563EB" opacity="0.9" />
            <circle cx="40" cy="110" r="16" fill="#2563EB" opacity="0.9" />
            <circle cx="40" cy="170" r="16" fill="#2563EB" opacity="0.9" />
            
            <!-- Layer 2 (Hidden) -->
            <circle cx="140" cy="30" r="18" fill="#38BDF8" opacity="0.9" />
            <circle cx="140" cy="80" r="18" fill="#38BDF8" opacity="0.9" />
            <circle cx="140" cy="140" r="18" fill="#38BDF8" opacity="0.9" />
            <circle cx="140" cy="190" r="18" fill="#38BDF8" opacity="0.9" />

            <!-- Layer 3 (Output) -->
            <circle cx="240" cy="80" r="18" fill="#6366F1" opacity="0.9" />
            <circle cx="240" cy="140" r="18" fill="#6366F1" opacity="0.9" />

            <!-- Synaptic Connections -->
            <line x1="40" y1="50" x2="140" y2="30" stroke="#0284C7" stroke-width="2" opacity="0.5" />
            <line x1="40" y1="50" x2="140" y2="80" stroke="#0284C7" stroke-width="2" opacity="0.5" />
            <line x1="40" y1="110" x2="140" y2="80" stroke="#0284C7" stroke-width="2" opacity="0.5" />
            <line x1="40" y1="110" x2="140" y2="140" stroke="#0284C7" stroke-width="2" opacity="0.5" />
            <line x1="40" y1="170" x2="140" y2="140" stroke="#0284C7" stroke-width="2" opacity="0.5" />
            <line x1="40" y1="170" x2="140" y2="190" stroke="#0284C7" stroke-width="2" opacity="0.5" />

            <line x1="140" y1="30" x2="240" y2="80" stroke="#6366F1" stroke-width="2" opacity="0.6" />
            <line x1="140" y1="80" x2="240" y2="80" stroke="#6366F1" stroke-width="2" opacity="0.6" />
            <line x1="140" y1="140" x2="240" y2="140" stroke="#6366F1" stroke-width="2" opacity="0.6" />
            <line x1="140" y1="190" x2="240" y2="140" stroke="#6366F1" stroke-width="2" opacity="0.6" />

            <rect x="20" y="220" width="240" height="28" rx="6" fill="#0284C7" fill-opacity="0.15" />
            <text x="140" y="239" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0284C7" text-anchor="middle">TRANSFORMER ATTENTION HEADS</text>
        </g>
        """
    },
    {
        "filename": "python-mastery-for-ai.svg",
        "title": "Modern Python for AI",
        "subtitle": "Internals, Metaprogramming & High-Throughput Streams",
        "light_bg": "#FFF8F0",
        "dark_bg": "#1A1520",
        "accent": "#D97706",
        "accent_secondary": "#3B82F6",
        "border": "#FED7AA",
        "badge_bg": "#FEF3C7",
        "badge_text": "#B45309",
        "category": "CORE PYTHON",
        "diagram": """
        <!-- CPython Stack & Bytecode Diagram -->
        <g transform="translate(470, 60)">
            <!-- Frame Box -->
            <rect x="20" y="20" width="250" height="70" rx="8" fill="#D97706" fill-opacity="0.12" stroke="#D97706" stroke-width="1.5" />
            <text x="35" y="45" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#B45309">PyFrameObject (Local Scope)</text>
            <text x="35" y="68" font-family="monospace" font-size="11" fill="#78350F">f_localsplus: [*args, **kwargs]</text>

            <!-- Memory Pointers -->
            <path d="M 145 90 L 145 125" stroke="#D97706" stroke-width="2" stroke-dasharray="3,3" />
            <polygon points="140,123 150,123 145,130" fill="#D97706" />

            <!-- Heap Object -->
            <rect x="20" y="130" width="250" height="75" rx="8" fill="#3B82F6" fill-opacity="0.12" stroke="#3B82F6" stroke-width="1.5" />
            <text x="35" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">PyObject (Heap Storage)</text>
            <text x="35" y="175" font-family="monospace" font-size="10.5" fill="#1E40AF">ob_refcnt: 42 | ob_type: int</text>
            <text x="35" y="193" font-family="monospace" font-size="10.5" fill="#1E40AF">__slots__ optimized storage</text>

            <rect x="20" y="220" width="250" height="28" rx="6" fill="#B45309" fill-opacity="0.15" />
            <text x="145" y="239" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#B45309" text-anchor="middle">DESCRIPTORS &amp; ZERO-COPY GENERATORS</text>
        </g>
        """
    },
    {
        "filename": "foundations-of-machine-learning.svg",
        "title": "Machine Learning Foundations",
        "subtitle": "Mathematical Intuition, Optimization & Evaluation",
        "light_bg": "#F0FDF4",
        "dark_bg": "#0D1F15",
        "accent": "#059669",
        "accent_secondary": "#10B981",
        "border": "#A7F3D0",
        "badge_bg": "#DCFCE7",
        "badge_text": "#047857",
        "category": "MACHINE LEARNING",
        "diagram": """
        <!-- Loss Function Curve & Gradient Descent -->
        <g transform="translate(480, 65)">
            <!-- Coordinate axes -->
            <line x1="20" y1="210" x2="260" y2="210" stroke="#059669" stroke-width="2" />
            <line x1="20" y1="210" x2="20" y2="20" stroke="#059669" stroke-width="2" />
            
            <!-- Convex Parabola Loss Curve -->
            <path d="M 35 40 Q 140 220 245 40" fill="none" stroke="#10B981" stroke-width="3" />
            
            <!-- Gradient Step Points -->
            <circle cx="55" cy="72" r="6" fill="#EF4444" />
            <circle cx="85" cy="125" r="6" fill="#F59E0B" />
            <circle cx="115" cy="162" r="6" fill="#10B981" />
            <circle cx="140" cy="175" r="7" fill="#047857" stroke="#FFFFFF" stroke-width="2" />
            
            <!-- Vectors -->
            <line x1="55" y1="72" x2="82" y2="120" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="2,2" />
            <line x1="85" y1="125" x2="112" y2="158" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2,2" />

            <!-- Minima label -->
            <text x="140" y="196" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">GLOBAL MINIMA</text>

            <rect x="20" y="225" width="240" height="26" rx="6" fill="#059669" fill-opacity="0.15" />
            <text x="140" y="242" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#047857" text-anchor="middle">STOCHASTIC GRADIENT DESCENT</text>
        </g>
        """
    },
    {
        "filename": "practical-rag-and-llm-engineering.svg",
        "title": "Production RAG & LLMs",
        "subtitle": "Vector Search, Knowledge Retrieval & AI Agents",
        "light_bg": "#FAF5FF",
        "dark_bg": "#1C142B",
        "accent": "#7C3AED",
        "accent_secondary": "#A855F7",
        "border": "#DDD6FE",
        "badge_bg": "#F3E8FF",
        "badge_text": "#6D28D9",
        "category": "APPLIED AI & RAG",
        "diagram": """
        <!-- RAG Architecture Pipeline -->
        <g transform="translate(470, 60)">
            <!-- Document Chunking -->
            <rect x="20" y="25" width="100" height="42" rx="6" fill="#7C3AED" fill-opacity="0.12" stroke="#7C3AED" stroke-width="1.5" />
            <text x="70" y="45" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#6D28D9" text-anchor="middle">Document Chunks</text>
            <text x="70" y="58" font-family="monospace" font-size="9" fill="#7C3AED" text-anchor="middle">1024 tokens</text>

            <path d="M 120 46 L 155 46" stroke="#7C3AED" stroke-width="2" />
            <polygon points="153,42 161,46 153,50" fill="#7C3AED" />

            <!-- Embeddings -->
            <rect x="165" y="25" width="105" height="42" rx="6" fill="#A855F7" fill-opacity="0.15" stroke="#A855F7" stroke-width="1.5" />
            <text x="217" y="45" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#6D28D9" text-anchor="middle">Dense Vectors</text>
            <text x="217" y="58" font-family="monospace" font-size="9" fill="#7C3AED" text-anchor="middle">1536 dims</text>

            <path d="M 217 67 L 217 105" stroke="#7C3AED" stroke-width="2" />
            <polygon points="213,103 217,111 221,103" fill="#7C3AED" />

            <!-- Vector Database -->
            <rect x="20" y="115" width="250" height="85" rx="8" fill="#7C3AED" fill-opacity="0.08" stroke="#7C3AED" stroke-width="1.5" />
            <text x="35" y="138" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#6D28D9">Vector Index (HNSW / Cosine)</text>
            
            <circle cx="55" cy="165" r="5" fill="#7C3AED" />
            <circle cx="105" cy="155" r="5" fill="#A855F7" />
            <circle cx="155" cy="175" r="5" fill="#7C3AED" />
            <circle cx="215" cy="160" r="5" fill="#A855F7" />
            <line x1="55" y1="165" x2="105" y2="155" stroke="#A855F7" stroke-width="1" stroke-dasharray="2,2" />
            <line x1="105" y1="155" x2="215" y2="160" stroke="#A855F7" stroke-width="1" stroke-dasharray="2,2" />

            <rect x="20" y="220" width="250" height="28" rx="6" fill="#7C3AED" fill-opacity="0.15" />
            <text x="145" y="239" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#6D28D9" text-anchor="middle">HYBRID RETRIEVAL &amp; AGENTIC ROUTING</text>
        </g>
        """
    }
]

out_dir = "/workspaces/website/public/assets/courses"
os.makedirs(out_dir, exist_ok=True)

for c in courses:
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <pattern id="dotGrid_{c['filename'].replace('.svg','')}" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="{c['accent']}" opacity="0.18" />
    </pattern>
    <style>
      .bg-fill {{ fill: {c['light_bg']}; }}
      .card-stroke {{ stroke: {c['border']}; stroke-width: 1.5; }}
      .title-text {{ font-family: 'Fraunces', Georgia, serif; font-size: 28px; font-weight: 700; fill: #0F172A; }}
      .subtitle-text {{ font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 14px; fill: #475569; }}
      @media (prefers-color-scheme: dark) {{
        .bg-fill {{ fill: {c['dark_bg']}; }}
        .title-text {{ fill: #F8FAFC; }}
        .subtitle-text {{ fill: #94A3B8; }}
        .card-stroke {{ stroke: rgba(255,255,255,0.12); }}
      }}
    </style>
  </defs>

  <!-- Background Base Canvas (Distinct non-grey) -->
  <rect width="100%" height="100%" class="bg-fill" />
  <rect width="100%" height="100%" fill="url(#dotGrid_{c['filename'].replace('.svg','')})" />

  <!-- Outer Frame -->
  <rect x="12" y="12" width="776" height="426" rx="16" fill="none" class="card-stroke" />

  <!-- Left Content Column -->
  <g transform="translate(48, 80)">
    <!-- Category Pill -->
    <rect x="0" y="0" width="140" height="26" rx="13" fill="{c['badge_bg']}" />
    <text x="70" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="800" fill="{c['badge_text']}" text-anchor="middle" letter-spacing="1">{c['category']}</text>

    <!-- Title & Subtitle -->
    <text x="0" y="65" class="title-text">{c['title']}</text>
    <text x="0" y="100" class="subtitle-text">{c['subtitle']}</text>

    <!-- Metrics Feature Strip -->
    <g transform="translate(0, 150)">
      <rect x="0" y="0" width="370" height="74" rx="10" fill="{c['accent']}" fill-opacity="0.08" stroke="{c['border']}" stroke-width="1" />
      
      <circle cx="30" cy="37" r="14" fill="{c['accent']}" fill-opacity="0.2" />
      <path d="M 24 37 L 28 41 L 37 32" stroke="{c['accent']}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />

      <text x="56" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="{c['accent']}">Verified Curriculum</text>
      <text x="56" y="50" font-family="system-ui, sans-serif" font-size="11" fill="#64748B">Hands-on code, interactive labs &amp; projects</text>
    </g>
  </g>

  <!-- Right Visual Diagram Column -->
  {c['diagram']}

  <!-- Footer Brand Accent -->
  <line x1="48" y1="390" x2="752" y2="390" stroke="{c['accent']}" stroke-width="1" opacity="0.25" />
  <text x="48" y="415" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="{c['accent']}">ENCODEEDGE LEARNING ACADEMY</text>
  <text x="752" y="415" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="end">PRACTICAL PRODUCTION MASTERY</text>
</svg>"""
    
    file_path = os.path.join(out_dir, c['filename'])
    with open(file_path, "w") as f:
        f.write(svg_content.strip())
    print(f"Generated {file_path}")

print("All course SVGs generated successfully!")

