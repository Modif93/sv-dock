export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.zfbjGAU0.js",app:"_app/immutable/entry/app.CK0-G6Un.js",imports:["_app/immutable/entry/start.zfbjGAU0.js","_app/immutable/chunks/D_TH-EQw.js","_app/immutable/chunks/yL3yhLMr.js","_app/immutable/chunks/DqgbVWNV.js","_app/immutable/entry/app.CK0-G6Un.js","_app/immutable/chunks/yL3yhLMr.js","_app/immutable/chunks/CPtZUZSF.js","_app/immutable/chunks/DTWq818J.js","_app/immutable/chunks/DqgbVWNV.js","_app/immutable/chunks/DRYdwFA0.js","_app/immutable/chunks/DtrD67Bl.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
