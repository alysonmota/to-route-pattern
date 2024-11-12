const Slash = '/'

type SlashType = typeof Slash
type ArrayOfString = Array<string>
type Tail<t extends ArrayOfString> = t extends [string, ...infer tail] ? (tail extends ArrayOfString ? tail : never) : never
type FirstFromArray<t extends ArrayOfString> = t extends [infer first, ...ArrayOfString] ? (first extends string ? first : never) : never
type JoinRecursive<t extends string, k extends ArrayOfString> = Tail<k> extends [string, ...infer tail]
	? tail extends ArrayOfString
		? `${t}${SlashType}${JoinRecursive<FirstFromArray<k>, Tail<k>>}`
		: t
	: `${t}${SlashType}${FirstFromArray<k>}`

type RemoveSlashes<t extends ArrayOfString> = t extends [infer e, ...ArrayOfString]
	? e extends SlashType
		? RemoveSlashes<Tail<t>>
		: e extends string
			? IsOnlySlashes<e> extends true
				? RemoveSlashes<Tail<t>>
				: [NormalizeString<e>, ...RemoveSlashes<Tail<t>>]
			: never
	: []

type NormalizeString<t extends string> = t extends `${SlashType}${infer suffix}`
	? NormalizeString<suffix>
	: t extends `${infer preffix}${SlashType}`
		? NormalizeString<preffix>
		: t
type IsOnlySlashes<t extends string> = t extends `${SlashType}` ? true : t extends `${SlashType}${infer rest}` ? IsOnlySlashes<rest> : false

type ToRoutePattern<t extends ArrayOfString> = RemoveSlashes<t> extends infer q
	? q extends ArrayOfString
		? q extends [SlashType]
			? `${SlashType}`
			: q extends Array<never>
				? `${SlashType}`
				: `${SlashType}${JoinRecursive<FirstFromArray<q>, Tail<q>>}`
		: never
	: never

function normalizeString(string: string): string {
	return string.replace(/^\/+|\/+$/g, String())
}

function toRoutePattern<t extends ArrayOfString>(...strings: t): ToRoutePattern<t> {
	return <ToRoutePattern<t>>Slash.concat(strings.map(normalizeString).filter(Boolean).join(Slash))
}

export { Slash, toRoutePattern, type ToRoutePattern }
