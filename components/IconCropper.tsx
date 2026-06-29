"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

type IconCropperProps = {
  currentIconUrl?: string;
  onUploaded: (url: string) => void;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function getCroppedImage(
  imageSrc: string,
  cropArea: Area
): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvasを作成できませんでした。");
  }

  canvas.width = 600;
  canvas.height = 600;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    600,
    600
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("画像の切り抜きに失敗しました。"));
          return;
        }

        resolve(
          new File([blob], "profile-icon.jpg", {
            type: "image/jpeg",
          })
        );
      },
      "image/jpeg",
      0.9
    );
  });
}

export default function IconCropper({
  currentIconUrl,
  onUploaded,
}: IconCropperProps) {
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("画像は10MB以下にしてください。");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    const compressedFile = await imageCompression(file, {
      maxWidthOrHeight: 1600,
      maxSizeMB: 2,
      useWebWorker: true,
    });

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
    };

    reader.readAsDataURL(compressedFile);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);

      const croppedFile = await getCroppedImage(
        imageSrc,
        croppedAreaPixels
      );

      const url = await uploadImageToCloudinary(croppedFile);

      onUploaded(url);

      alert(
        "アイコン画像を設定しました。\n最後にプロフィールを保存してください。"
      );

      setImageSrc("");
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (error) {
      console.error(error);
      alert("アイコン画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-white p-5">
      <p className="mb-3 text-sm font-bold text-slate-800">
        アイコン画像
      </p>

      {currentIconUrl && !imageSrc && (
        <img
          src={currentIconUrl}
          alt="現在のアイコン"
          className="mb-4 h-24 w-24 rounded-full border object-cover"
        />
      )}

      <input
        id="icon-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleSelectFile(file);
          }

          // 同じ画像を選択し直せるようにする
          e.target.value = "";
        }}
      />

      <label
        htmlFor="icon-upload"
        className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        📷 アイコン画像を変更
      </label>

      {imageSrc && (
        <div className="mt-5">
          <div className="relative h-72 overflow-hidden rounded-2xl bg-slate-900">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) =>
                setCroppedAreaPixels(areaPixels)
              }
            />
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) =>
              setZoom(Number(e.target.value))
            }
            className="mt-4 w-full"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setImageSrc("");
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              className="flex-1 rounded-2xl border px-5 py-3 font-bold text-slate-700"
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isUploading
                ? "アップロード中..."
                : "決定"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}