import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CategoryView from "./pages/CategoryView.tsx";

const TextCounter   = lazy(() => import("./pages/tools/TextCounter"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const Whitespace    = lazy(() => import("./pages/tools/Whitespace"));
const TextSort      = lazy(() => import("./pages/tools/TextSort"));
const ImageCompress = lazy(() => import("./pages/tools/ImageCompress"));
const ImageResize   = lazy(() => import("./pages/tools/ImageResize"));
const ImageConvert  = lazy(() => import("./pages/tools/ImageConvert"));
const ImageRotate   = lazy(() => import("./pages/tools/ImageRotate"));
const ImageCrop     = lazy(() => import("./pages/tools/ImageCrop"));
const JsonFormat    = lazy(() => import("./pages/tools/JsonFormat"));
const Base64Tool    = lazy(() => import("./pages/tools/Base64"));
const UrlCodec      = lazy(() => import("./pages/tools/UrlCodec"));
const HtmlPreview   = lazy(() => import("./pages/tools/HtmlPreview"));
const CssMinify     = lazy(() => import("./pages/tools/CssMinify"));
const PdfViewer     = lazy(() => import("./pages/tools/PdfViewer"));
const PdfExtract    = lazy(() => import("./pages/tools/PdfExtract"));
const MultiTab      = lazy(() => import("./pages/tools/MultiTab"));

const PasswordGen   = lazy(() => import("./pages/tools/PasswordGen"));
const QrGen         = lazy(() => import("./pages/tools/QrGen"));
const Lorem         = lazy(() => import("./pages/tools/Lorem"));
const Uuid          = lazy(() => import("./pages/tools/Uuid"));
const Slug          = lazy(() => import("./pages/tools/Slug"));
const RandomNum     = lazy(() => import("./pages/tools/RandomNum"));
const Dice          = lazy(() => import("./pages/tools/Dice"));
const CoinFlip      = lazy(() => import("./pages/tools/CoinFlip"));
const FaviconGen    = lazy(() => import("./pages/tools/FaviconGen"));
const ColorPicker   = lazy(() => import("./pages/tools/ColorPicker"));
const UnitConvert   = lazy(() => import("./pages/tools/UnitConvert"));
const DateCalc      = lazy(() => import("./pages/tools/DateCalc"));
const Calculator    = lazy(() => import("./pages/tools/Calculator"));
const Timestamp     = lazy(() => import("./pages/tools/Timestamp"));
const IpInfo        = lazy(() => import("./pages/tools/IpInfo"));
const CsvJson       = lazy(() => import("./pages/tools/CsvJson"));
const YamlJson      = lazy(() => import("./pages/tools/YamlJson"));
const JsonTs        = lazy(() => import("./pages/tools/JsonTs"));
const MdHtml        = lazy(() => import("./pages/tools/MdHtml"));
const SqlFormat     = lazy(() => import("./pages/tools/SqlFormat"));
const NumberBase    = lazy(() => import("./pages/tools/NumberBase"));
const ImageBase64   = lazy(() => import("./pages/tools/ImageBase64"));
const HashTool      = lazy(() => import("./pages/tools/Hash"));
const RegexTool     = lazy(() => import("./pages/tools/RegexTool"));
const Jwt           = lazy(() => import("./pages/tools/Jwt"));
const Diff          = lazy(() => import("./pages/tools/Diff"));
const CookieTool    = lazy(() => import("./pages/tools/CookieTool"));
const Contrast      = lazy(() => import("./pages/tools/Contrast"));
const AsciiArt      = lazy(() => import("./pages/tools/AsciiArt"));
const ImageAscii    = lazy(() => import("./pages/tools/ImageAscii"));
const MeshGradient  = lazy(() => import("./pages/tools/MeshGradient"));
const GlassUi       = lazy(() => import("./pages/tools/GlassUi"));
const ShadowStudio  = lazy(() => import("./pages/tools/ShadowStudio"));
const PaletteLab    = lazy(() => import("./pages/tools/PaletteLab"));
const AudioViz      = lazy(() => import("./pages/tools/AudioViz"));
const SpeechText    = lazy(() => import("./pages/tools/SpeechText"));
const WandCleanup   = lazy(() => import("./pages/tools/WandCleanup"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="h-10 w-1/3 rounded-xl bg-white/[0.04] animate-pulse" />
    <div className="h-72 w-full rounded-2xl bg-white/[0.03] animate-pulse" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-right" theme="dark" toastOptions={{
        classNames: { toast: "!bg-black/70 !backdrop-blur-xl !border !border-white/10 !text-foreground !rounded-xl" },
      }} />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryView />} />
            <Route path="/tools/text-counter"   element={<Suspense fallback={<Loader />}><TextCounter /></Suspense>} />
            <Route path="/tools/case-converter" element={<Suspense fallback={<Loader />}><CaseConverter /></Suspense>} />
            <Route path="/tools/whitespace"     element={<Suspense fallback={<Loader />}><Whitespace /></Suspense>} />
            <Route path="/tools/text-sort"      element={<Suspense fallback={<Loader />}><TextSort /></Suspense>} />
            <Route path="/tools/image-compress" element={<Suspense fallback={<Loader />}><ImageCompress /></Suspense>} />
            <Route path="/tools/image-resize"   element={<Suspense fallback={<Loader />}><ImageResize /></Suspense>} />
            <Route path="/tools/image-convert"  element={<Suspense fallback={<Loader />}><ImageConvert /></Suspense>} />
            <Route path="/tools/image-rotate"   element={<Suspense fallback={<Loader />}><ImageRotate /></Suspense>} />
            <Route path="/tools/image-crop"     element={<Suspense fallback={<Loader />}><ImageCrop /></Suspense>} />
            <Route path="/tools/json-format"    element={<Suspense fallback={<Loader />}><JsonFormat /></Suspense>} />
            <Route path="/tools/base64"         element={<Suspense fallback={<Loader />}><Base64Tool /></Suspense>} />
            <Route path="/tools/url-codec"      element={<Suspense fallback={<Loader />}><UrlCodec /></Suspense>} />
            <Route path="/tools/html-preview"   element={<Suspense fallback={<Loader />}><HtmlPreview /></Suspense>} />
            <Route path="/tools/css-minify"     element={<Suspense fallback={<Loader />}><CssMinify /></Suspense>} />
            <Route path="/tools/pdf-viewer"     element={<Suspense fallback={<Loader />}><PdfViewer /></Suspense>} />
            <Route path="/tools/pdf-extract"    element={<Suspense fallback={<Loader />}><PdfExtract /></Suspense>} />
            <Route path="/tools/multi-tab"      element={<Suspense fallback={<Loader />}><MultiTab /></Suspense>} />
            <Route path="/tools/password-gen"   element={<Suspense fallback={<Loader />}><PasswordGen /></Suspense>} />
            <Route path="/tools/qr-gen"         element={<Suspense fallback={<Loader />}><QrGen /></Suspense>} />
            <Route path="/tools/lorem"          element={<Suspense fallback={<Loader />}><Lorem /></Suspense>} />
            <Route path="/tools/uuid"           element={<Suspense fallback={<Loader />}><Uuid /></Suspense>} />
            <Route path="/tools/slug"           element={<Suspense fallback={<Loader />}><Slug /></Suspense>} />
            <Route path="/tools/random-num"     element={<Suspense fallback={<Loader />}><RandomNum /></Suspense>} />
            <Route path="/tools/dice"           element={<Suspense fallback={<Loader />}><Dice /></Suspense>} />
            <Route path="/tools/coin-flip"      element={<Suspense fallback={<Loader />}><CoinFlip /></Suspense>} />
            <Route path="/tools/favicon-gen"    element={<Suspense fallback={<Loader />}><FaviconGen /></Suspense>} />
            <Route path="/tools/color-picker"   element={<Suspense fallback={<Loader />}><ColorPicker /></Suspense>} />
            <Route path="/tools/unit-convert"   element={<Suspense fallback={<Loader />}><UnitConvert /></Suspense>} />
            <Route path="/tools/date-calc"      element={<Suspense fallback={<Loader />}><DateCalc /></Suspense>} />
            <Route path="/tools/calculator"     element={<Suspense fallback={<Loader />}><Calculator /></Suspense>} />
            <Route path="/tools/timestamp"      element={<Suspense fallback={<Loader />}><Timestamp /></Suspense>} />
            <Route path="/tools/ip-info"        element={<Suspense fallback={<Loader />}><IpInfo /></Suspense>} />
            <Route path="/tools/csv-json"       element={<Suspense fallback={<Loader />}><CsvJson /></Suspense>} />
            <Route path="/tools/yaml-json"      element={<Suspense fallback={<Loader />}><YamlJson /></Suspense>} />
            <Route path="/tools/json-ts"        element={<Suspense fallback={<Loader />}><JsonTs /></Suspense>} />
            <Route path="/tools/md-html"        element={<Suspense fallback={<Loader />}><MdHtml /></Suspense>} />
            <Route path="/tools/sql-format"     element={<Suspense fallback={<Loader />}><SqlFormat /></Suspense>} />
            <Route path="/tools/number-base"    element={<Suspense fallback={<Loader />}><NumberBase /></Suspense>} />
            <Route path="/tools/image-base64"   element={<Suspense fallback={<Loader />}><ImageBase64 /></Suspense>} />
            <Route path="/tools/hash"           element={<Suspense fallback={<Loader />}><HashTool /></Suspense>} />
            <Route path="/tools/regex"          element={<Suspense fallback={<Loader />}><RegexTool /></Suspense>} />
            <Route path="/tools/jwt"            element={<Suspense fallback={<Loader />}><Jwt /></Suspense>} />
            <Route path="/tools/diff"           element={<Suspense fallback={<Loader />}><Diff /></Suspense>} />
            <Route path="/tools/cookie"         element={<Suspense fallback={<Loader />}><CookieTool /></Suspense>} />
            <Route path="/tools/contrast"       element={<Suspense fallback={<Loader />}><Contrast /></Suspense>} />
            <Route path="/tools/ascii-art"      element={<Suspense fallback={<Loader />}><AsciiArt /></Suspense>} />
            <Route path="/tools/image-ascii"    element={<Suspense fallback={<Loader />}><ImageAscii /></Suspense>} />
            <Route path="/tools/mesh-gradient"  element={<Suspense fallback={<Loader />}><MeshGradient /></Suspense>} />
            <Route path="/tools/glass-ui"       element={<Suspense fallback={<Loader />}><GlassUi /></Suspense>} />
            <Route path="/tools/shadow-studio"  element={<Suspense fallback={<Loader />}><ShadowStudio /></Suspense>} />
            <Route path="/tools/palette-lab"    element={<Suspense fallback={<Loader />}><PaletteLab /></Suspense>} />
            <Route path="/tools/audio-viz"      element={<Suspense fallback={<Loader />}><AudioViz /></Suspense>} />
            <Route path="/tools/speech-text"    element={<Suspense fallback={<Loader />}><SpeechText /></Suspense>} />
            <Route path="/tools/wand-cleanup"   element={<Suspense fallback={<Loader />}><WandCleanup /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
