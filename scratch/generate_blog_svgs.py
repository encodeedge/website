import os

os.makedirs("public/assets/blog", exist_ok=True)

# Helper to build clean, modern, cohesive SVG illustrations
def make_svg(theme_color, accent_color, diagram_svg, bg_light="#FFF8F0", bg_dark="#191520"):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="{theme_color}" opacity="0.18" />
    </pattern>
  </defs>

  <style>
    .bg-canvas {{ fill: {bg_light}; }}
    .diagram-card {{ fill: #FFFFFF; stroke: {theme_color}; stroke-width: 2px; }}
    .diagram-node {{ fill: #FFFFFF; stroke: #CBD5E1; stroke-width: 1.5px; }}
    .diagram-text {{ fill: #0F172A; }}
    .diagram-subtext {{ fill: #64748B; }}
    .diagram-line {{ stroke: #94A3B8; }}

    @media (prefers-color-scheme: dark) {{
      .bg-canvas {{ fill: {bg_dark} !important; }}
      .diagram-card {{ fill: #1E2538 !important; stroke: {theme_color} !important; stroke-width: 2px !important; }}
      .diagram-node {{ fill: #161D2B !important; stroke: #334155 !important; stroke-width: 1.5px !important; }}
      .diagram-text {{ fill: #F8FAFC !important; }}
      .diagram-subtext {{ fill: #94A3B8 !important; }}
      .diagram-line {{ stroke: #475569 !important; }}
    }}
  </style>

  <!-- Clean Tinted Canvas (Distinct from grey page background) -->
  <rect width="800" height="450" class="bg-canvas" />
  <rect width="800" height="450" fill="url(#gridPattern)" />

  <!-- Diagram Visual -->
  {diagram_svg}
</svg>"""

svgs = {
    "python-variables-and-memory-references.svg": make_svg("#FDA4AF", "#A2D2FF", """
  <g transform="translate(140, 100)">
    <!-- Variable Identifiers -->
    <rect x="0" y="20" width="130" height="60" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="65" y="55" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#0F172A" class="diagram-text">var_a = 42</text>

    <rect x="0" y="140" width="130" height="60" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="65" y="175" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#0F172A" class="diagram-text">var_b = 42</text>

    <!-- Pointer Arrows -->
    <path d="M 130 50 C 220 50, 240 100, 310 105" fill="none" stroke="#FDA4AF" stroke-width="3" stroke-linecap="round" />
    <polygon points="315,105 305,100 305,110" fill="#FDA4AF" />

    <path d="M 130 170 C 220 170, 240 120, 310 115" fill="none" stroke="#A2D2FF" stroke-width="3" stroke-linecap="round" />
    <polygon points="315,115 305,110 305,120" fill="#A2D2FF" />

    <!-- Shared Heap Object Cell -->
    <rect x="320" y="50" width="200" height="120" rx="20" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2.5" class="diagram-card" />
    <rect x="340" y="70" width="160" height="24" rx="8" fill="#FDA4AF" opacity="0.2" />
    <text x="420" y="86" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#E11D48">0x7FA3B02840</text>
    <text x="420" y="125" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="800" fill="#0F172A" class="diagram-text">int: 42</text>
    <text x="420" y="152" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748B" class="diagram-subtext">ref_count: 2</text>
  </g>
"""),

    "python-type-hierarchy.svg": make_svg("#FDA4AF", "#E5E795", """
  <g transform="translate(120, 70)">
    <!-- Root: object -->
    <rect x="210" y="0" width="140" height="46" rx="12" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <text x="280" y="28" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">object</text>

    <!-- Branch Lines -->
    <path d="M 280 46 L 280 90 M 80 90 L 480 90 M 80 90 L 80 130 M 280 90 L 280 130 M 480 90 L 480 130" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />

    <!-- Subtypes -->
    <rect x="20" y="130" width="120" height="42" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" class="diagram-node" />
    <text x="80" y="156" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#0F172A" class="diagram-text">Numbers</text>

    <rect x="220" y="130" width="120" height="42" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" class="diagram-node" />
    <text x="280" y="156" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#0F172A" class="diagram-text">Sequences</text>

    <rect x="420" y="130" width="120" height="42" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" class="diagram-node" />
    <text x="480" y="156" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#0F172A" class="diagram-text">Mappings</text>

    <!-- Leaf Nodes -->
    <g transform="translate(0, 200)">
      <rect x="10" y="0" width="60" height="30" rx="8" fill="#FDA4AF" opacity="0.25" />
      <text x="40" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">int</text>

      <rect x="80" y="0" width="60" height="30" rx="8" fill="#FDA4AF" opacity="0.25" />
      <text x="110" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">float</text>

      <rect x="210" y="0" width="60" height="30" rx="8" fill="#E5E795" opacity="0.35" />
      <text x="240" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">list</text>

      <rect x="280" y="0" width="60" height="30" rx="8" fill="#E5E795" opacity="0.35" />
      <text x="310" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">tuple</text>

      <rect x="440" y="0" width="80" height="30" rx="8" fill="#A2D2FF" opacity="0.25" />
      <text x="480" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">dict</text>
    </g>
  </g>
"""),

    "python-function-parameters-and-arguments.svg": make_svg("#FDA4AF", "#C084FC", """
  <g transform="translate(110, 110)">
    <!-- Function signature banner -->
    <rect x="0" y="0" width="580" height="70" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-card" />
    <g transform="translate(20, 20)">
      <rect x="0" y="0" width="80" height="30" rx="6" fill="#FDA4AF" opacity="0.25" />
      <text x="40" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0F172A" class="diagram-text">pos_only</text>

      <text x="95" y="20" font-family="monospace" font-size="14" font-weight="700" fill="#64748B">/</text>

      <rect x="115" y="0" width="80" height="30" rx="6" fill="#A2D2FF" opacity="0.25" />
      <text x="155" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0F172A" class="diagram-text">standard</text>

      <rect x="210" y="0" width="70" height="30" rx="6" fill="#FFB86A" opacity="0.25" />
      <text x="245" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0F172A" class="diagram-text">*args</text>

      <rect x="295" y="0" width="85" height="30" rx="6" fill="#E5E795" opacity="0.3" />
      <text x="337" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0F172A" class="diagram-text">kw_only</text>

      <rect x="395" y="0" width="90" height="30" rx="6" fill="#C084FC" opacity="0.25" />
      <text x="440" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0F172A" class="diagram-text">**kwargs</text>
    </g>
    <!-- Descriptive call mapping below -->
    <g transform="translate(40, 110)">
      <circle cx="10" cy="10" r="6" fill="#FDA4AF" />
      <text x="30" y="15" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748B" class="diagram-subtext">Positional-Only Enforcement (PEP 570)</text>
      <circle cx="310" cy="10" r="6" fill="#C084FC" />
      <text x="330" y="15" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748B" class="diagram-subtext">Arbitrary Keyword Ingestion</text>
    </g>
  </g>
"""),

    "python-first-class-functions-and-lambdas.svg": make_svg("#FDA4AF", "#A2D2FF", """
  <g transform="translate(120, 110)">
    <!-- Pipeline flow: Input -> Function Transformer -> Output -->
    <rect x="0" y="30" width="110" height="60" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="55" y="65" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">[1, 2, 3, 4]</text>

    <path d="M 110 60 L 180 60" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" class="diagram-line" />
    <polygon points="185,60 175,55 175,65" fill="#A2D2FF" />

    <!-- Higher Order Function Block -->
    <rect x="190" y="10" width="180" height="100" rx="18" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2.5" class="diagram-card" />
    <text x="280" y="45" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#FDA4AF">map(func, data)</text>
    <rect x="210" y="60" width="140" height="30" rx="8" fill="#FDA4AF" opacity="0.2" />
    <text x="280" y="80" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F172A" class="diagram-text">lambda x: x * 2</text>

    <path d="M 370 60 L 440 60" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" class="diagram-line" />
    <polygon points="445,60 435,55 435,65" fill="#FDA4AF" />

    <rect x="450" y="30" width="110" height="60" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="505" y="65" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">[2, 4, 6, 8]</text>
  </g>
"""),

    "python-scopes-closures-and-decorators.svg": make_svg("#FDA4AF", "#C084FC", """
  <g transform="translate(160, 50)">
    <!-- Nested Scope Rings -->
    <rect x="0" y="0" width="480" height="300" rx="28" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" opacity="0.6" class="diagram-card" />
    <text x="30" y="35" font-family="monospace" font-size="12" font-weight="700" fill="#94A3B8">Built-in Scope (__builtins__)</text>

    <rect x="30" y="50" width="420" height="220" rx="22" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="1.5" class="diagram-card" />
    <text x="55" y="80" font-family="monospace" font-size="12" font-weight="700" fill="#60A5FA">Global Scope (module)</text>

    <rect x="60" y="100" width="360" height="145" rx="18" fill="#FFFFFF" stroke="#C084FC" stroke-width="2" class="diagram-card" />
    <text x="85" y="130" font-family="monospace" font-size="12" font-weight="700" fill="#A855F7">Enclosing Scope (free variable cell)</text>

    <rect x="90" y="145" width="300" height="75" rx="14" fill="#FDA4AF" fill-opacity="0.15" stroke="#FDA4AF" stroke-width="2" />
    <text x="240" y="188" text-anchor="middle" font-family="monospace" font-size="14" font-weight="800" fill="#0F172A" class="diagram-text">Local Scope &amp; @decorator</text>
  </g>
"""),

    "python-tuples-and-namedtuples.svg": make_svg("#FDA4AF", "#FFB86A", """
  <g transform="translate(130, 100)">
    <!-- Tuple contiguous memory buffer -->
    <g transform="translate(0, 20)">
      <rect x="0" y="0" width="130" height="60" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
      <text x="65" y="35" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">[0] "AAPL"</text>
      <text x="65" y="52" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#94A3B8">symbol</text>

      <rect x="140" y="0" width="130" height="60" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
      <text x="205" y="35" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">[1] 185.50</text>
      <text x="205" y="52" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#94A3B8">price</text>

      <rect x="280" y="0" width="130" height="60" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
      <text x="345" y="35" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#0F172A" class="diagram-text">[2] 10000</text>
      <text x="345" y="52" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#94A3B8">volume</text>

      <rect x="420" y="0" width="120" height="60" rx="10" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
      <text x="480" y="35" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#FDA4AF">__slots__</text>
      <text x="480" y="52" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#94A3B8">0-dict overhead</text>
    </g>
    <text x="270" y="140" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#64748B" class="diagram-subtext">namedtuple: Attribute access + Tuple memory compactness</text>
  </g>
"""),

    "python-modules-packages-and-namespaces.svg": make_svg("#FDA4AF", "#A2D2FF", """
  <g transform="translate(130, 80)">
    <!-- Package Folder Node -->
    <rect x="0" y="20" width="150" height="120" rx="16" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <path d="M 0 35 L 50 35 L 65 50 L 150 50" fill="none" stroke="#FDA4AF" stroke-width="1.5" />
    <text x="75" y="80" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#0F172A" class="diagram-text">package/</text>
    <text x="75" y="105" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#FDA4AF">__init__.py</text>

    <!-- Import Line -->
    <path d="M 150 80 L 260 80" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="4 4" class="diagram-line" />
    <polygon points="265,80 255,75 255,85" fill="#A2D2FF" />

    <!-- sys.modules Cache Box -->
    <rect x="270" y="10" width="260" height="140" rx="18" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="2" class="diagram-card" />
    <rect x="290" y="25" width="110" height="24" rx="6" fill="#A2D2FF" opacity="0.25" />
    <text x="345" y="41" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0284C7">sys.modules</text>

    <text x="290" y="80" font-family="monospace" font-size="12" font-weight="600" fill="#0F172A" class="diagram-text">"pkg": &lt;module&gt;</text>
    <text x="290" y="105" font-family="monospace" font-size="12" font-weight="600" fill="#0F172A" class="diagram-text">"pkg.core": &lt;module&gt;</text>
    <text x="290" y="130" font-family="monospace" font-size="10" font-weight="600" fill="#64748B" class="diagram-subtext">Singleton Cache Map</text>
  </g>
"""),

    "python-iterables-iterators-and-generators.svg": make_svg("#FDA4AF", "#E5E795", """
  <g transform="translate(120, 100)">
    <!-- Stream Sequence -->
    <g transform="translate(0, 10)">
      <circle cx="40" cy="40" r="28" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
      <text x="40" y="46" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#0F172A" class="diagram-text">1</text>

      <path d="M 70 40 L 130 40" fill="none" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />
      <text x="100" y="30" text-anchor="middle" font-family="monospace" font-size="10" fill="#94A3B8">yield</text>

      <circle cx="160" cy="40" r="28" fill="#FFFFFF" stroke="#E5E795" stroke-width="2" class="diagram-card" />
      <text x="160" y="46" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#0F172A" class="diagram-text">2</text>

      <path d="M 190 40 L 250 40" fill="none" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />
      <text x="220" y="30" text-anchor="middle" font-family="monospace" font-size="10" fill="#94A3B8">yield</text>

      <circle cx="280" cy="40" r="28" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="2" class="diagram-card" />
      <text x="280" y="46" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#0F172A" class="diagram-text">3</text>

      <!-- Generator State Box -->
      <rect x="350" y="0" width="200" height="80" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-card" />
      <text x="450" y="34" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#059669">GEN_SUSPENDED</text>
      <text x="450" y="58" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748B" class="diagram-subtext">O(1) Memory Footprint</text>
    </g>
  </g>
"""),

    "python-context-managers-and-with-blocks.svg": make_svg("#FDA4AF", "#C084FC", """
  <g transform="translate(140, 80)">
    <!-- with block container -->
    <rect x="0" y="0" width="520" height="190" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-card" />
    
    <rect x="20" y="20" width="130" height="40" rx="10" fill="#A2D2FF" opacity="0.25" />
    <text x="85" y="45" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0284C7">__enter__()</text>

    <path d="M 150 40 L 200 40 L 200 80 L 230 80" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />

    <rect x="230" y="55" width="260" height="60" rx="12" fill="#FDA4AF" opacity="0.15" stroke="#FDA4AF" stroke-width="1.5" />
    <text x="360" y="85" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#0F172A" class="diagram-text">with-block execution</text>
    <text x="360" y="103" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#64748B" class="diagram-subtext">Deterministic Resource Scoping</text>

    <path d="M 360 115 L 360 145 L 200 145 L 150 145" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />

    <rect x="20" y="125" width="130" height="40" rx="10" fill="#C084FC" opacity="0.25" />
    <text x="85" y="150" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#7C3AED">__exit__()</text>
  </g>
"""),

    "python-dictionaries-sets-and-hashmaps.svg": make_svg("#FDA4AF", "#FFB86A", """
  <g transform="translate(100, 70)">
    <!-- Split Table Layout (Indices Array + Entries Array) -->
    <text x="90" y="20" font-family="monospace" font-size="12" font-weight="700" fill="#64748B">Indices Array (Sparse Bytes)</text>
    <g transform="translate(0, 30)">
      <rect x="0" y="0" width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" class="diagram-node" />
      <text x="20" y="25" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" class="diagram-text">0</text>

      <rect x="45" y="0" width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" class="diagram-node" />
      <text x="65" y="25" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#CBD5E1">-1</text>

      <rect x="90" y="0" width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" class="diagram-node" />
      <text x="110" y="25" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" class="diagram-text">1</text>

      <rect x="135" y="0" width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" class="diagram-node" />
      <text x="155" y="25" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#CBD5E1">-1</text>
    </g>

    <text x="350" y="20" font-family="monospace" font-size="12" font-weight="700" fill="#64748B">Entries Array (Dense [hash, key, val])</text>
    <g transform="translate(250, 30)">
      <rect x="0" y="0" width="340" height="45" rx="10" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
      <text x="15" y="28" font-family="monospace" font-size="12" font-weight="600" class="diagram-text">0: [0x4A1F, "user_id", 101]</text>

      <rect x="0" y="55" width="340" height="45" rx="10" fill="#FFFFFF" stroke="#FFB86A" stroke-width="2" class="diagram-card" />
      <text x="15" y="83" font-family="monospace" font-size="12" font-weight="600" class="diagram-text">1: [0x8B3C, "status", "active"]</text>
    </g>
  </g>
"""),

    "python-serialization-and-json.svg": make_svg("#FDA4AF", "#A2D2FF", """
  <g transform="translate(130, 90)">
    <!-- Live Python Object -->
    <rect x="0" y="20" width="160" height="110" rx="16" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <text x="80" y="50" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#FDA4AF">Python Object</text>
    <text x="80" y="75" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" class="diagram-text">User(id=42)</text>
    <text x="80" y="98" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" class="diagram-text">datetime.now()</text>

    <!-- Flow Arrow with JSONEncoder -->
    <path d="M 160 75 L 340 75" fill="none" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />
    <rect x="200" y="55" width="100" height="26" rx="8" fill="#A2D2FF" opacity="0.3" />
    <text x="250" y="72" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#0284C7">JSONEncoder</text>

    <!-- JSON String / Stream -->
    <rect x="340" y="20" width="180" height="110" rx="16" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="2" class="diagram-card" />
    <text x="430" y="50" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0284C7">JSON Document</text>
    <text x="430" y="78" text-anchor="middle" font-family="monospace" font-size="12" font-weight="600" class="diagram-text">&#123; "id": 42 &#125;</text>
    <text x="430" y="102" text-anchor="middle" font-family="monospace" font-size="10" font-weight="600" fill="#64748B" class="diagram-subtext">Wire Protocol</text>
  </g>
"""),

    "python-object-oriented-programming-and-dunder-methods.svg": make_svg("#FDA4AF", "#C084FC", """
  <g transform="translate(130, 80)">
    <!-- Class Node -->
    <rect x="0" y="0" width="220" height="90" rx="16" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <text x="110" y="30" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" class="diagram-text">class Account:</text>
    <text x="110" y="55" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#64748B">__mro__ (C3 Linearization)</text>
    <text x="110" y="75" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#FDA4AF">__repr__, __add__</text>

    <path d="M 110 90 L 110 140" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />
    <polygon points="110,145 105,135 115,135" fill="#C084FC" />

    <!-- Instance Node -->
    <rect x="0" y="145" width="220" height="75" rx="16" fill="#FFFFFF" stroke="#C084FC" stroke-width="2" class="diagram-card" />
    <text x="110" y="175" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" class="diagram-text">acc = Account()</text>
    <text x="110" y="200" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#64748B">Bound Method Descriptor</text>

    <!-- Slots Callout -->
    <rect x="270" y="50" width="230" height="110" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="385" y="85" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#0F172A" class="diagram-text">__slots__ = ('balance',)</text>
    <text x="385" y="110" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#059669">68% Memory Reduction</text>
    <text x="385" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="500" fill="#94A3B8">Eliminates __dict__ table</text>
  </g>
"""),

    "python-descriptors-and-metaprogramming.svg": make_svg("#FDA4AF", "#A2D2FF", """
  <g transform="translate(120, 80)">
    <!-- Descriptor Interceptor Block -->
    <rect x="180" y="20" width="200" height="150" rx="20" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2.5" class="diagram-card" />
    <text x="280" y="55" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#FDA4AF">Descriptor Protocol</text>
    
    <rect x="200" y="70" width="160" height="28" rx="8" fill="#FDA4AF" opacity="0.2" />
    <text x="280" y="89" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" class="diagram-text">__get__(obj, cls)</text>

    <rect x="200" y="105" width="160" height="28" rx="8" fill="#A2D2FF" opacity="0.2" />
    <text x="280" y="124" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" class="diagram-text">__set__(obj, val)</text>

    <rect x="200" y="140" width="160" height="20" rx="6" fill="#CBD5E1" opacity="0.3" />
    <text x="280" y="154" text-anchor="middle" font-family="monospace" font-size="10" font-weight="600" class="diagram-subtext">__set_name__()</text>

    <!-- Caller Left -->
    <path d="M 70 95 L 180 95" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />
    <text x="120" y="85" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600">user.age</text>

    <!-- Instance Storage Right -->
    <path d="M 380 95 L 480 95" fill="none" stroke="#CBD5E1" stroke-width="2" class="diagram-line" />
    <text x="430" y="85" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600">_age</text>
  </g>
"""),

    "python-enumerations-and-exceptions.svg": make_svg("#FDA4AF", "#E5E795", """
  <g transform="translate(130, 80)">
    <!-- Enum Flags Box -->
    <rect x="0" y="20" width="220" height="140" rx="18" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <text x="110" y="55" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#FDA4AF">enum.Flag Bitmask</text>
    <text x="110" y="85" text-anchor="middle" font-family="monospace" font-size="12" class="diagram-text">READ = 1</text>
    <text x="110" y="105" text-anchor="middle" font-family="monospace" font-size="12" class="diagram-text">WRITE = 2</text>
    <text x="110" y="130" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#0284C7">READ | WRITE = 3</text>

    <!-- Exception Chaining Box -->
    <rect x="270" y="20" width="250" height="140" rx="18" fill="#FFFFFF" stroke="#E5E795" stroke-width="2" class="diagram-card" />
    <text x="395" y="55" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#CA8A04">PEP 3134 Chaining</text>
    <text x="395" y="85" text-anchor="middle" font-family="monospace" font-size="12" class="diagram-text">raise ServiceError()</text>
    <text x="395" y="110" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#E11D48">from original_err</text>
    <text x="395" y="135" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#64748B">Preserves __cause__</text>
  </g>
"""),

    "regression-error-metrics.svg": make_svg("#FDA4AF", "#C084FC", """
  <g transform="translate(140, 70)">
    <!-- Scatter plot grid -->
    <line x1="40" y1="200" x2="480" y2="200" stroke="#94A3B8" stroke-width="2" />
    <line x1="40" y1="200" x2="40" y2="20" stroke="#94A3B8" stroke-width="2" />

    <!-- Regression Line -->
    <line x1="60" y1="180" x2="460" y2="40" stroke="#A2D2FF" stroke-width="3" stroke-linecap="round" />

    <!-- Residual Error Dashes -->
    <line x1="140" y1="152" x2="140" y2="90" stroke="#FDA4AF" stroke-width="2" stroke-dasharray="3 3" />
    <circle cx="140" cy="90" r="5" fill="#FDA4AF" />

    <line x1="260" y1="110" x2="260" y2="160" stroke="#FDA4AF" stroke-width="2" stroke-dasharray="3 3" />
    <circle cx="260" cy="160" r="5" fill="#FDA4AF" />

    <line x1="380" y1="68" x2="380" y2="110" stroke="#FDA4AF" stroke-width="2" stroke-dasharray="3 3" />
    <circle cx="380" cy="110" r="5" fill="#FDA4AF" />

    <!-- Formula Badges -->
    <rect x="320" y="140" width="180" height="50" rx="10" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="2" class="diagram-card" />
    <text x="410" y="165" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" class="diagram-text">MAE, MSE, RMSE, R²</text>
    <text x="410" y="180" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="600" fill="#64748B">Residual Metrics</text>
  </g>
""", bg_light="#FFF1F3", bg_dark="#1E1318"),

    "regression-simple-linear-regresison.svg": make_svg("#A2D2FF", "#E5E795", """
  <g transform="translate(140, 70)">
    <!-- Axes -->
    <line x1="40" y1="200" x2="480" y2="200" stroke="#94A3B8" stroke-width="2" />
    <line x1="40" y1="200" x2="40" y2="20" stroke="#94A3B8" stroke-width="2" />

    <!-- Best fit line -->
    <line x1="60" y1="170" x2="460" y2="50" stroke="#A2D2FF" stroke-width="3.5" stroke-linecap="round" />

    <!-- Data points -->
    <circle cx="100" cy="150" r="5" fill="#0284C7" />
    <circle cx="160" cy="130" r="5" fill="#0284C7" />
    <circle cx="220" cy="120" r="5" fill="#0284C7" />
    <circle cx="290" cy="95" r="5" fill="#0284C7" />
    <circle cx="370" cy="70" r="5" fill="#0284C7" />
    <circle cx="430" cy="65" r="5" fill="#0284C7" />

    <rect x="260" y="130" width="220" height="50" rx="12" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="2" class="diagram-card" />
    <text x="370" y="155" text-anchor="middle" font-family="monospace" font-size="14" font-weight="800" class="diagram-text">y = mx + b</text>
    <text x="370" y="172" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#64748B">Ordinary Least Squares</text>
  </g>
""", bg_light="#F0FDF4", bg_dark="#0C1F17"),

    "introduction-to-machine-learning.svg": make_svg("#A2D2FF", "#C084FC", """
  <g transform="translate(80, 80)">
    <!-- 4 Pipeline Stages -->
    <rect x="0" y="40" width="130" height="70" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-node" />
    <text x="65" y="70" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" class="diagram-text">1. Data Prep</text>
    <text x="65" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">Raw Features</text>

    <path d="M 130 75 L 170 75" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />

    <rect x="170" y="40" width="130" height="70" rx="14" fill="#FFFFFF" stroke="#A2D2FF" stroke-width="2" class="diagram-card" />
    <text x="235" y="70" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#0284C7">2. Model Train</text>
    <text x="235" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">Optimization</text>

    <path d="M 300 75 L 340 75" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />

    <rect x="340" y="40" width="130" height="70" rx="14" fill="#FFFFFF" stroke="#E5E795" stroke-width="2" class="diagram-card" />
    <text x="405" y="70" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#CA8A04">3. Evaluate</text>
    <text x="405" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">Loss &amp; Accuracy</text>

    <path d="M 470 75 L 510 75" stroke="#CBD5E1" stroke-width="2.5" class="diagram-line" />

    <rect x="510" y="40" width="130" height="70" rx="14" fill="#FFFFFF" stroke="#C084FC" stroke-width="2" class="diagram-card" />
    <text x="575" y="70" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#7C3AED">4. Deploy</text>
    <text x="575" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">Inference API</text>
  </g>
""", bg_light="#F0F7FF", bg_dark="#0C1829"),

    "welcome-to-encode-edge.svg": make_svg("#A2D2FF", "#FDA4AF", """
  <g transform="translate(150, 70)">
    <rect x="40" y="20" width="420" height="150" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" class="diagram-card" />
    
    <!-- Central Monogram -->
    <rect x="215" y="45" width="70" height="70" rx="18" fill="url(#primaryAccent)" />
    <text x="250" y="92" text-anchor="middle" font-family="serif" font-size="32" font-weight="800" fill="#FFFFFF">EE</text>

    <text x="250" y="145" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" class="diagram-text">EncodeEdge Architecture</text>
  </g>
""", bg_light="#FAF5FF", bg_dark="#1A1224"),
}

for filename, content in svgs.items():
    filepath = os.path.join("public/assets/blog", filename)
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Wrote {filepath}")
