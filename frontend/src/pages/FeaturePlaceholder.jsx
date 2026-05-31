import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function FeaturePlaceholder({
  onLogoutClick,
  title,
  titleIcon,
  heading,
  description,
  icon,
  backTo = "/wallet",
  backLabel = "Back to Wallet",
}) {
  return (
    <AppLayout title={title} titleIcon={titleIcon} onLogoutClick={onLogoutClick}>
      <div className="p-8 flex items-center justify-center min-h-full">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-blue-600">
              {icon}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">{heading}</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{description}</p>
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {backLabel}
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
