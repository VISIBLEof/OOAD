(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OOAD Project/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/OOAD Project/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
'use client';
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://hippmmotshyilrbrvwmh.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHBtbW90c2h5aWxyYnJ2d21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjA2OTQsImV4cCI6MjA3ODkzNjY5NH0.-0yV6SnKJ3loFYlsF6XWj5jdp2TpOU1u2yp5yZlL1bo");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const __TURBOPACK__default__export__ = supabase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OOAD Project/components/auth/SyncSession.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SyncSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/lib/supabaseClient.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SyncSession() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SyncSession.useEffect": ()=>{
            let mounted = true;
            async function sync() {
                try {
                    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].auth.getSession();
                    const accessToken = data?.session?.access_token;
                    if (accessToken) {
                        await fetch('/api/auth/sync', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                access_token: accessToken
                            })
                        });
                    }
                } catch (err) {
                    // swallow — sync is best-effort
                    console.error('SyncSession error:', err);
                }
            }
            if (mounted) sync();
            return ({
                "SyncSession.useEffect": ()=>{
                    mounted = false;
                }
            })["SyncSession.useEffect"];
        }
    }["SyncSession.useEffect"], []);
    return null;
}
_s(SyncSession, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = SyncSession;
var _c;
__turbopack_context__.k.register(_c, "SyncSession");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OOAD%20Project_8150a8f6._.js.map