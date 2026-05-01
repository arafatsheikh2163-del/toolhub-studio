/**
 * Multi-language tool usage guidelines.
 * Languages: en, bn, es, hi, ar, fr, de, pt, zh, ja
 *
 * Structure: GUIDES[toolId][lang] = { steps: string[], tips?: string[] }
 * If a specific language is missing for a tool, we fall back to English.
 */

export const LANGUAGES = [
  { code: "en", label: "English",   native: "English",   rtl: false },
  { code: "bn", label: "Bangla",    native: "বাংলা",      rtl: false },
  { code: "es", label: "Spanish",   native: "Español",   rtl: false },
  { code: "hi", label: "Hindi",     native: "हिन्दी",      rtl: false },
  { code: "ar", label: "Arabic",    native: "العربية",    rtl: true  },
  { code: "fr", label: "French",    native: "Français",  rtl: false },
  { code: "de", label: "German",    native: "Deutsch",   rtl: false },
  { code: "pt", label: "Portuguese",native: "Português", rtl: false },
  { code: "zh", label: "Chinese",   native: "中文",       rtl: false },
  { code: "ja", label: "Japanese",  native: "日本語",     rtl: false },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];

export interface Guide {
  steps: string[];
  tips?: string[];
}

type GuideMap = Partial<Record<LangCode, Guide>>;

/** Tiny helper to keep authoring readable. */
const g = (steps: string[], tips?: string[]): Guide => ({ steps, tips });

/* ---------------- Featured tools — fully localized ---------------- */

const codeTranslate: GuideMap = {
  en: g(
    [
      "Type what you want in any language — describe inputs, outputs, and any rules.",
      "Pick the target language (HTML, Python, JavaScript, etc).",
      "Click Generate code. The AI returns a clean, idiomatic snippet.",
      "Use Preview for HTML, or Copy / Download to save the file.",
    ],
    ["Be specific about edge cases.", "For HTML you'll get a live preview right next to the code."],
  ),
  bn: g(
    [
      "যেকোনো ভাষায় লিখুন — ইনপুট, আউটপুট এবং নিয়ম স্পষ্ট করে দিন।",
      "টার্গেট ভাষা সিলেক্ট করুন (HTML, Python, JavaScript ইত্যাদি)।",
      "Generate code চাপুন — পরিষ্কার কোড পেয়ে যাবেন।",
      "HTML হলে Preview দেখুন, বা Copy / Download দিয়ে ফাইল সেভ করুন।",
    ],
    ["এজ-কেস বুঝিয়ে লিখলে কোড আরও সঠিক হবে।", "HTML সিলেক্ট করলে লাইভ প্রিভিউ দেখাবে।"],
  ),
  es: g([
    "Describe lo que quieres en cualquier idioma — entradas, salidas y reglas.",
    "Elige el lenguaje destino (HTML, Python, JavaScript…).",
    "Haz clic en Generate code para obtener el snippet.",
    "Usa Preview para HTML o Copy / Download para guardarlo.",
  ]),
  hi: g([
    "किसी भी भाषा में बताएँ कि आप क्या चाहते हैं।",
    "टार्गेट भाषा चुनें (HTML, Python, आदि)।",
    "Generate code पर क्लिक करें।",
    "HTML के लिए Preview देखें, या Copy / Download करें।",
  ]),
  ar: g([
    "اكتب ما تريد بأي لغة — صف المدخلات والمخرجات والقواعد.",
    "اختر لغة البرمجة المستهدفة (HTML، Python، JavaScript…).",
    "اضغط Generate code للحصول على الكود.",
    "استخدم Preview لـ HTML أو Copy / Download للحفظ.",
  ]),
  fr: g([
    "Décrivez ce que vous voulez dans n'importe quelle langue.",
    "Choisissez le langage cible (HTML, Python, JavaScript…).",
    "Cliquez sur Generate code.",
    "Aperçu pour le HTML, sinon Copy / Download.",
  ]),
  de: g([
    "Beschreiben Sie in beliebiger Sprache, was der Code tun soll.",
    "Wählen Sie die Zielsprache (HTML, Python, JavaScript…).",
    "Auf Generate code klicken.",
    "Vorschau für HTML, oder Copy / Download.",
  ]),
  pt: g([
    "Descreva em qualquer idioma o que precisa.",
    "Escolha a linguagem alvo (HTML, Python…).",
    "Clique em Generate code.",
    "Use Preview no HTML ou Copy / Download.",
  ]),
  zh: g([
    "用任何语言描述你需要的功能。",
    "选择目标语言(HTML、Python、JavaScript 等)。",
    "点击 Generate code 生成代码。",
    "HTML 可以使用 Preview,其他用 Copy / Download。",
  ]),
  ja: g([
    "どの言語でも、欲しいコードの内容を書きます。",
    "ターゲット言語(HTML, Python, JavaScript…)を選択。",
    "Generate code をクリック。",
    "HTML は Preview、他は Copy / Download で保存。",
  ]),
};

const bgRemove: GuideMap = {
  en: g(["Drop or pick an image (JPG / PNG / WEBP up to ~20 MB).", "The AI cutout model loads once, then runs entirely in your browser.", "Wait until the progress shows 100%.", "Click Download PNG to save the transparent result."],
        ["Works best on portraits, products, and pets.", "First run downloads the model, so it can take ~10 seconds."]),
  bn: g(["একটি ছবি ড্রপ করুন বা সিলেক্ট করুন (JPG/PNG/WEBP, সর্বোচ্চ ~২০ MB)।", "AI মডেল একবার লোড হবে, তারপর পুরোপুরি ব্রাউজারে চলবে।", "প্রসেসিং ১০০% হওয়া পর্যন্ত অপেক্ষা করুন।", "Download PNG চাপলে স্বচ্ছ ব্যাকগ্রাউন্ডসহ ছবি পেয়ে যাবেন।"],
        ["পোর্ট্রেট, প্রোডাক্ট, পোষা প্রাণীর ছবিতে সবচেয়ে ভালো কাজ করে।", "প্রথমবার মডেল ডাউনলোড হয় বলে কিছুটা সময় লাগে।"]),
  es: g(["Suelta o elige una imagen (JPG / PNG / WEBP).", "El modelo se carga una vez y se ejecuta en tu navegador.", "Espera al 100%.", "Pulsa Download PNG para guardar el resultado transparente."]),
  hi: g(["कोई इमेज ड्रॉप या चुनें।", "मॉडल एक बार लोड होगा, फिर ब्राउज़र में चलेगा।", "100% होने तक रुकें।", "Download PNG से ट्रांसपेरेंट इमेज सेव करें।"]),
  ar: g(["أسقط أو اختر صورة (JPG / PNG / WEBP).", "يتم تحميل النموذج مرة واحدة ثم يعمل داخل المتصفح.", "انتظر حتى الوصول إلى 100%.", "اضغط Download PNG لحفظ الصورة الشفافة."]),
  fr: g(["Déposez ou choisissez une image.", "Le modèle se charge une fois puis tourne dans le navigateur.", "Attendez 100%.", "Download PNG pour enregistrer le résultat transparent."]),
  de: g(["Bild ablegen oder auswählen.", "Modell lädt einmal, läuft danach im Browser.", "Auf 100% warten.", "Download PNG zum Speichern."]),
  pt: g(["Solte ou escolha uma imagem.", "O modelo carrega uma vez e roda no navegador.", "Aguarde 100%.", "Download PNG para salvar."]),
  zh: g(["拖入或选择图片。", "模型只下载一次,之后在浏览器内运行。", "等待进度到 100%。", "点击 Download PNG 保存透明结果。"]),
  ja: g(["画像をドロップまたは選択。", "モデルは初回のみ読み込み、以降はブラウザ内で動作。", "100% になるまで待機。", "Download PNG で透過 PNG を保存。"]),
};

const ytPicker: GuideMap = {
  en: g(["Paste any public YouTube video URL or just the video ID.", "Set how many winners you want and toggle uniqueness.", "Click Load comments. Auto mode reads visible comments.", "If a video is restricted, paste comments manually below — one per line.", "Click Pick winners — animation reveals the chosen entries."],
        ["Use @user: comment format for clean parsing.", "Manual mode always works for any video."]),
  bn: g(["যেকোনো পাবলিক YouTube URL বা ভিডিও ID পেস্ট করুন।", "কতজন বিজয়ী চান সিলেক্ট করুন, ইউনিক রাখবেন কিনা ঠিক করুন।", "Load comments চাপুন।", "ভিডিও রেস্ট্রিক্টেড হলে নিচে কমেন্ট ম্যানুয়ালি পেস্ট করুন (প্রতি লাইনে একটি)।", "Pick winners চাপলে অ্যানিমেশনসহ বিজয়ী দেখাবে।"]),
  es: g(["Pega la URL o el ID del video.", "Define cuántos ganadores y si deben ser únicos.", "Pulsa Load comments.", "Si el video está restringido, pega comentarios manualmente abajo.", "Pulsa Pick winners."]),
  hi: g(["YouTube URL या video ID पेस्ट करें।", "विजेताओं की संख्या चुनें।", "Load comments दबाएँ।", "Restricted video के लिए कमेंट manually पेस्ट करें।", "Pick winners दबाएँ।"]),
  ar: g(["الصق رابط أو معرف فيديو يوتيوب.", "حدد عدد الفائزين.", "اضغط Load comments.", "للفيديوهات المقيدة، الصق التعليقات يدوياً.", "اضغط Pick winners."]),
  fr: g(["Collez l'URL ou l'ID vidéo YouTube.", "Choisissez le nombre de gagnants.", "Cliquez Load comments.", "Pour une vidéo restreinte, collez les commentaires manuellement.", "Cliquez Pick winners."]),
  de: g(["YouTube-URL oder Video-ID einfügen.", "Anzahl der Gewinner wählen.", "Load comments klicken.", "Bei eingeschränkten Videos Kommentare manuell einfügen.", "Pick winners klicken."]),
  pt: g(["Cole a URL ou ID do vídeo do YouTube.", "Defina quantos vencedores.", "Clique Load comments.", "Em vídeos restritos cole comentários manualmente.", "Clique Pick winners."]),
  zh: g(["粘贴 YouTube 视频链接或 ID。", "设置中奖人数。", "点击 Load comments。", "受限视频请手动粘贴评论(每行一个)。", "点击 Pick winners 抽奖。"]),
  ja: g(["YouTube の URL または ID を貼り付け。", "当選者数を設定。", "Load comments をクリック。", "制限付き動画はコメントを手動で貼り付け。", "Pick winners をクリック。"]),
};

const multiTab: GuideMap = {
  en: g(["Type a URL and press Enter to add a frame.", "Pick a grid layout from 1×1 up to 4×4.", "Drag frames by the handle to rearrange.", "Click refresh on a frame, or Refresh all."],
        ["If a site shows 'blocks embedding', click Open in new tab — it can't be displayed inline."]),
  bn: g(["URL টাইপ করে Enter চাপুন — ফ্রেম যোগ হবে।", "1×1 থেকে 4×4 পর্যন্ত গ্রিড লেআউট সিলেক্ট করুন।", "হ্যান্ডেল দিয়ে ড্র্যাগ করে ফ্রেম সাজান।", "প্রতিটি ফ্রেমে রিফ্রেশ আছে, বা Refresh all চাপুন।"],
        ["সাইট ইনলাইন না দেখালে Open in new tab চাপুন।"]),
  es: g(["Escribe una URL y pulsa Enter.", "Elige una rejilla 1×1 a 4×4.", "Arrastra los marcos para reordenar.", "Refresca individual o todos."]),
  hi: g(["URL टाइप करें और Enter दबाएँ।", "1×1 से 4×4 grid चुनें।", "Drag करके फ्रेम rearrange करें।", "Refresh करें।"]),
  ar: g(["اكتب رابطاً واضغط Enter.", "اختر شبكة من 1×1 حتى 4×4.", "اسحب الإطارات لإعادة ترتيبها.", "حدّث إطاراً واحداً أو الكل."]),
  fr: g(["Tapez une URL puis Entrée.", "Choisissez une grille 1×1 à 4×4.", "Glissez pour réorganiser.", "Rafraîchissez à la demande."]),
  de: g(["URL eingeben + Enter.", "Raster 1×1 bis 4×4 wählen.", "Per Drag neu anordnen.", "Einzeln oder alle aktualisieren."]),
  pt: g(["Digite uma URL e Enter.", "Escolha grade 1×1 até 4×4.", "Arraste para reorganizar.", "Atualize individual ou todos."]),
  zh: g(["输入网址并按 Enter。", "选择 1×1 到 4×4 网格。", "拖动重新排列。", "可单独或全部刷新。"]),
  ja: g(["URL を入力して Enter。", "1×1 〜 4×4 のレイアウトを選択。", "ドラッグして並び替え。", "個別または全体を更新。"]),
};

const tts: GuideMap = {
  en: g(["Type or paste any text.", "Pick a voice and adjust rate / pitch.", "Press Play to hear it, or Download to save the audio."]),
  bn: g(["লেখা টাইপ বা পেস্ট করুন।", "ভয়েস সিলেক্ট করুন, স্পিড ও পিচ ঠিক করুন।", "Play চাপলে শুনতে পারবেন, Download চাপলে অডিও সেভ হবে।"]),
  es: g(["Escribe o pega texto.", "Elige una voz y ajusta velocidad y tono.", "Pulsa Play o Download."]),
  hi: g(["टेक्स्ट टाइप या पेस्ट करें।", "Voice चुनें और speed/pitch सेट करें।", "Play या Download दबाएँ।"]),
  ar: g(["اكتب أو الصق نصاً.", "اختر صوتاً واضبط السرعة والنبرة.", "اضغط Play أو Download."]),
  fr: g(["Saisissez ou collez du texte.", "Choisissez une voix, réglez vitesse et hauteur.", "Lecture ou Téléchargement."]),
  de: g(["Text eingeben oder einfügen.", "Stimme wählen, Tempo und Tonhöhe einstellen.", "Wiedergeben oder Herunterladen."]),
  pt: g(["Escreva ou cole o texto.", "Escolha a voz e ajuste velocidade e tom.", "Play ou Download."]),
  zh: g(["输入或粘贴文本。", "选择语音,调整速度和音调。", "Play 或 Download。"]),
  ja: g(["テキストを入力または貼り付け。", "ボイスを選び、速度とピッチを調整。", "Play または Download。"]),
};

const generic: GuideMap = {
  en: g(["Provide your input on the left or top of the workspace.", "Adjust any settings if available.", "The result updates live — copy or download from the toolbar."]),
  bn: g(["বাম দিকে বা উপরে ইনপুট দিন।", "প্রয়োজন হলে সেটিংস ঠিক করুন।", "রেজাল্ট লাইভ আপডেট হয় — উপরের টুলবার থেকে কপি বা ডাউনলোড করুন।"]),
  es: g(["Introduce tus datos a la izquierda o arriba.", "Ajusta las opciones si las hay.", "El resultado se actualiza en vivo — copia o descarga."]),
  hi: g(["बाएँ या ऊपर इनपुट दें।", "सेटिंग्स adjust करें।", "परिणाम live update होता है — copy / download करें।"]),
  ar: g(["أدخل البيانات في اليسار أو الأعلى.", "اضبط الإعدادات إن وجدت.", "تتحدث النتيجة مباشرة — انسخ أو نزّل."]),
  fr: g(["Saisissez votre entrée à gauche ou en haut.", "Ajustez les réglages.", "Le résultat se met à jour en direct."]),
  de: g(["Eingabe links oder oben einfügen.", "Einstellungen anpassen.", "Ergebnis aktualisiert sich live."]),
  pt: g(["Insira os dados à esquerda ou no topo.", "Ajuste as opções.", "Resultado atualiza ao vivo."]),
  zh: g(["在左侧或顶部输入内容。", "调整可用的设置。", "结果实时更新,可复制或下载。"]),
  ja: g(["左側または上部に入力。", "必要に応じて設定を調整。", "結果はリアルタイム更新、コピーまたはダウンロード可能。"]),
};

export const GUIDES: Record<string, GuideMap> = {
  "code-translate": codeTranslate,
  "bg-remove":      bgRemove,
  "yt-comment-picker": ytPicker,
  "multi-tab":      multiTab,
  "tts":            tts,
};

export function getGuide(toolId: string, lang: LangCode): Guide {
  const map = GUIDES[toolId] ?? generic;
  return map[lang] ?? map.en ?? generic.en!;
}
