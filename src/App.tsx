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
const FindReplace   = lazy(() => import("./pages/tools/FindReplace"));
const Notepad       = lazy(() => import("./pages/tools/Notepad"));

const ImageCompress = lazy(() => import("./pages/tools/ImageCompress"));
const ImageResize   = lazy(() => import("./pages/tools/ImageResize"));
const ImageConvert  = lazy(() => import("./pages/tools/ImageConvert"));
const ImageRotate   = lazy(() => import("./pages/tools/ImageRotate"));
const ImageCrop     = lazy(() => import("./pages/tools/ImageCrop"));
const ImageWatermark= lazy(() => import("./pages/tools/ImageWatermark"));
const WebcamCapture = lazy(() => import("./pages/tools/WebcamCapture"));
const BgRemove      = lazy(() => import("./pages/tools/BgRemove"));
const YtCommentPicker = lazy(() => import("./pages/tools/YtCommentPicker"));
const CodeTranslate = lazy(() => import("./pages/tools/CodeTranslate"));

const JsonFormat    = lazy(() => import("./pages/tools/JsonFormat"));
const Base64Tool    = lazy(() => import("./pages/tools/Base64"));
const UrlCodec      = lazy(() => import("./pages/tools/UrlCodec"));
const HtmlPreview   = lazy(() => import("./pages/tools/HtmlPreview"));
const CssMinify     = lazy(() => import("./pages/tools/CssMinify"));

const PdfViewer     = lazy(() => import("./pages/tools/PdfViewer"));
const PdfExtract    = lazy(() => import("./pages/tools/PdfExtract"));
const PdfMerge      = lazy(() => import("./pages/tools/PdfMerge"));
const PdfSplit      = lazy(() => import("./pages/tools/PdfSplit"));

const MultiTab      = lazy(() => import("./pages/tools/MultiTab"));

const PasswordGen   = lazy(() => import("./pages/tools/PasswordGen"));
const QrGen         = lazy(() => import("./pages/tools/QrGen"));
const Lorem         = lazy(() => import("./pages/tools/Lorem"));
const Uuid          = lazy(() => import("./pages/tools/Uuid"));
const Slug          = lazy(() => import("./pages/tools/Slug"));
const RandomNum     = lazy(() => import("./pages/tools/RandomNum"));

const ColorPicker   = lazy(() => import("./pages/tools/ColorPicker"));
const UnitConvert   = lazy(() => import("./pages/tools/UnitConvert"));
const DateCalc      = lazy(() => import("./pages/tools/DateCalc"));
const Calculator    = lazy(() => import("./pages/tools/Calculator"));
const Timestamp     = lazy(() => import("./pages/tools/Timestamp"));
const IpInfo        = lazy(() => import("./pages/tools/IpInfo"));
const Pomodoro      = lazy(() => import("./pages/tools/Pomodoro"));

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
const Contrast      = lazy(() => import("./pages/tools/Contrast"));
const Encrypt       = lazy(() => import("./pages/tools/Encrypt"));

const ShadowStudio  = lazy(() => import("./pages/tools/ShadowStudio"));
const PaletteLab    = lazy(() => import("./pages/tools/PaletteLab"));
const GradientGen   = lazy(() => import("./pages/tools/GradientGen"));
const SpeechText    = lazy(() => import("./pages/tools/SpeechText"));
const Tts           = lazy(() => import("./pages/tools/Tts"));

const SimpleTool    = lazy(() => import("./pages/SimpleToolPage"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="h-10 w-1/3 rounded-xl bg-foreground/5 animate-pulse" />
    <div className="h-72 w-full rounded-2xl bg-foreground/5 animate-pulse" />
  </div>
);

const wrap = (E: React.ComponentType) => <Suspense fallback={<Loader />}><E /></Suspense>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-right" toastOptions={{
        classNames: { toast: "!bg-card !border !border-border !text-foreground !rounded-xl !shadow-lg" },
      }} />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryView />} />
            <Route path="/tools/text-counter"   element={wrap(TextCounter)} />
            <Route path="/tools/case-converter" element={wrap(CaseConverter)} />
            <Route path="/tools/whitespace"     element={wrap(Whitespace)} />
            <Route path="/tools/text-sort"      element={wrap(TextSort)} />
            <Route path="/tools/find-replace"   element={wrap(FindReplace)} />
            <Route path="/tools/notepad"        element={wrap(Notepad)} />

            <Route path="/tools/image-compress" element={wrap(ImageCompress)} />
            <Route path="/tools/image-resize"   element={wrap(ImageResize)} />
            <Route path="/tools/image-convert"  element={wrap(ImageConvert)} />
            <Route path="/tools/image-rotate"   element={wrap(ImageRotate)} />
            <Route path="/tools/image-crop"     element={wrap(ImageCrop)} />
            <Route path="/tools/image-watermark"element={wrap(ImageWatermark)} />
            <Route path="/tools/webcam-capture" element={wrap(WebcamCapture)} />
            <Route path="/tools/bg-remove"      element={wrap(BgRemove)} />
            <Route path="/tools/yt-comment-picker" element={wrap(YtCommentPicker)} />
            <Route path="/tools/code-translate" element={wrap(CodeTranslate)} />

            <Route path="/tools/json-format"    element={wrap(JsonFormat)} />
            <Route path="/tools/base64"         element={wrap(Base64Tool)} />
            <Route path="/tools/url-codec"      element={wrap(UrlCodec)} />
            <Route path="/tools/html-preview"   element={wrap(HtmlPreview)} />
            <Route path="/tools/css-minify"     element={wrap(CssMinify)} />

            <Route path="/tools/pdf-viewer"     element={wrap(PdfViewer)} />
            <Route path="/tools/pdf-extract"    element={wrap(PdfExtract)} />
            <Route path="/tools/pdf-merge"      element={wrap(PdfMerge)} />
            <Route path="/tools/pdf-split"      element={wrap(PdfSplit)} />

            <Route path="/tools/multi-tab"      element={wrap(MultiTab)} />

            <Route path="/tools/password-gen"   element={wrap(PasswordGen)} />
            <Route path="/tools/qr-gen"         element={wrap(QrGen)} />
            <Route path="/tools/lorem"          element={wrap(Lorem)} />
            <Route path="/tools/uuid"           element={wrap(Uuid)} />
            <Route path="/tools/slug"           element={wrap(Slug)} />
            <Route path="/tools/random-num"     element={wrap(RandomNum)} />

            <Route path="/tools/color-picker"   element={wrap(ColorPicker)} />
            <Route path="/tools/unit-convert"   element={wrap(UnitConvert)} />
            <Route path="/tools/date-calc"      element={wrap(DateCalc)} />
            <Route path="/tools/calculator"     element={wrap(Calculator)} />
            <Route path="/tools/timestamp"      element={wrap(Timestamp)} />
            <Route path="/tools/ip-info"        element={wrap(IpInfo)} />
            <Route path="/tools/pomodoro"       element={wrap(Pomodoro)} />

            <Route path="/tools/csv-json"       element={wrap(CsvJson)} />
            <Route path="/tools/yaml-json"      element={wrap(YamlJson)} />
            <Route path="/tools/json-ts"        element={wrap(JsonTs)} />
            <Route path="/tools/md-html"        element={wrap(MdHtml)} />
            <Route path="/tools/sql-format"     element={wrap(SqlFormat)} />
            <Route path="/tools/number-base"    element={wrap(NumberBase)} />
            <Route path="/tools/image-base64"   element={wrap(ImageBase64)} />

            <Route path="/tools/hash"           element={wrap(HashTool)} />
            <Route path="/tools/regex"          element={wrap(RegexTool)} />
            <Route path="/tools/jwt"            element={wrap(Jwt)} />
            <Route path="/tools/diff"           element={wrap(Diff)} />
            <Route path="/tools/contrast"       element={wrap(Contrast)} />
            <Route path="/tools/encrypt"        element={wrap(Encrypt)} />

            <Route path="/tools/shadow-studio"  element={wrap(ShadowStudio)} />
            <Route path="/tools/palette-lab"    element={wrap(PaletteLab)} />
            <Route path="/tools/gradient-gen"   element={wrap(GradientGen)} />
            <Route path="/tools/speech-text"    element={wrap(SpeechText)} />
            <Route path="/tools/tts"            element={wrap(Tts)} />

            {/* Generic registry-driven tools — see src/data/simpleTools.ts */}
            <Route path="/t/:id"                element={wrap(SimpleTool)} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
