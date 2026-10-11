const translations = {
    en: {
        "badge": "✨ 100% On-Device & Private",
        "hero_title": "SnapSweep",
        "hero_tagline": "Clean your gallery. Free your storage with smart on-device intelligence.",
        "why_title": "Why SnapSweep?",
        "why_desc": "SnapSweep isn't just another junk cleaner. It combines fast storage scanning with lightweight on-device intelligence to help you understand your gallery, find redundant items, and review files safely before cleanup.",
        "feat_privacy_title": "🔒 Privacy First",
        "feat_privacy_desc": "Your photos and videos never leave your device. All analysis runs locally.",
        "feat_smart_title": "🧠 Smart Insights",
        "feat_smart_desc": "Detect exact duplicates, similar photos, screenshots, and large files effortlessly.",
        "feat_safe_title": "🛡️ Safe Cleanup",
        "feat_safe_desc": "AI recommends. You decide. Files are moved securely to system trash.",
        "privacy_title": "Privacy Policy",
        "terms_title": "Terms of Service",
        "back_home": "← Back to Home",
        "footer_rights": "© 2026 SnapSweep. All rights reserved."
    },
    vi: {
        "badge": "✨ 100% Trên thiết bị & Riêng tư",
        "hero_title": "SnapSweep",
        "hero_tagline": "Dọn dẹp thư viện ảnh. Giải phóng bộ nhớ với trí tuệ thông minh trên thiết bị.",
        "why_title": "Tại sao chọn SnapSweep?",
        "why_desc": "SnapSweep không chỉ là một ứng dụng dọn rác thông thường. Nó kết hợp quét dung lượng nhanh chóng với trí tuệ nhân tạo nhẹ trên thiết bị giúp bạn hiểu rõ thư viện ảnh, tìm kiếm các mục trùng lặp và xem xét file an toàn trước khi dọn dẹp.",
        "feat_privacy_title": "🔒 Ưu tiên quyền riêng tư",
        "feat_privacy_desc": "Ảnh và video của bạn không bao giờ rời khỏi thiết bị. Mọi phân tích diễn ra cục bộ.",
        "feat_smart_title": "🧠 Thông minh & Tinh tế",
        "feat_smart_desc": "Phát hiện chính xác file trùng lặp, ảnh tương tự, ảnh chụp màn hình và video lớn dễ dàng.",
        "feat_safe_title": "🛡️ Dọn dẹp an toàn",
        "feat_safe_desc": "AI gợi ý, bạn quyết định. File được chuyển an toàn vào thùng rác hệ thống.",
        "privacy_title": "Chính sách bảo mật",
        "terms_title": "Điều khoản sử dụng",
        "back_home": "← Về trang chủ",
        "footer_rights": "© 2026 SnapSweep. Bản quyền thuộc về SnapSweep."
    },
    ja: {
        "badge": "✨ 100% デバイス内処理・プライベート",
        "hero_title": "SnapSweep",
        "hero_tagline": "ギャラリーを綺麗に。スマートなデバイス内AIでストレージを解放。",
        "why_title": "SnapSweepが選ばれる理由",
        "why_desc": "単なるゴミ箱清掃アプリではありません。高速なストレージスキャンと軽量なデバイス内AIを組み合わせ、ギャラリーの整理、重複ファイルの発見、安全なクリーンアップをサポートします。",
        "feat_privacy_title": "🔒 プライバシー第一",
        "feat_privacy_desc": "写真や動画がデバイス外に出ることはありません。すべての分析はローカルで実行されます。",
        "feat_smart_title": "🧠 スマートインサイト",
        "feat_smart_desc": "完全な重複、類似写真、スクリーンショット、大容量ファイルを簡単に検出します。",
        "feat_safe_title": "🛡️ 安全なクリーンアップ",
        "feat_safe_desc": "AIは提案し、決定するのはあなたです。ファイルは安全にシステムゴミ箱へ移動されます。",
        "privacy_title": "プライバシーポリシー",
        "terms_title": "利用規約",
        "back_home": "← ホームに戻る",
        "footer_rights": "© 2026 SnapSweep. All rights reserved."
    }
};

function changeLanguage(lang) {
    localStorage.setItem('preferred_language', lang);
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = savedLang;
        selector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
    changeLanguage(savedLang);
});
