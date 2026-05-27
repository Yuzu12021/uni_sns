export function roleColor(role: string) {
  if (role === "プログラマ") {
    return "bg-blue-50 text-blue-600";
  }

  if (role === "グラフィッカー") {
    return "bg-pink-50 text-pink-600";
  }

  if (role === "サウンド") {
    return "bg-purple-50 text-purple-600";
  }

  if (role === "企画") {
    return "bg-orange-50 text-orange-600";
  }

  if (role === "シナリオ") {
    return "bg-green-50 text-green-600";
  }

  return "bg-gray-100 text-gray-600";
}