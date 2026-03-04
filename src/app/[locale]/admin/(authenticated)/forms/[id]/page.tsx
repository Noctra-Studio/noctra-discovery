import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";

export default function FormDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations("admin.formDetail");

  return (
    <div>
      <h1 className="text-2xl font-display mb-4">
        {t("title")}: {params.id}
      </h1>
      <p className="font-body text-gray-500">{t("noSubmission")}</p>
    </div>
  );
}
