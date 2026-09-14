import { type DocsLocale } from "../../i18n";
import Example from "../cascader";
export default function ParentSelection({ locale = "en" }: { locale?: DocsLocale }) {
	return <Example locale={locale} changeOnSelect />;
}
