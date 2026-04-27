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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
