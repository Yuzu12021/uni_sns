"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { getUserProfile } from "../../../services/userService";
import {
  sendChatMessage,
  subscribeChatMessages,
} from "../../../services/chatService";
import { UserProfile } from "../../../types/user";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const { uid, email, photoURL } = useAuthUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;

      const data = await getUserProfile(uid);
      setProfile(data);
    };

    fetchProfile();
  }, [uid]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeChatMessages(chatId, setMessages);

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!uid || !text.trim()) return;

    const senderName =
      profile?.nickname || profile?.name || email || "ユーザー";

    const senderIconUrl =
      profile?.iconUrl ||
      photoURL ||
      "https://placehold.jp/150x150.png";

    await sendChatMessage({
      chatId,
      senderId: uid,
      senderName,
      senderIconUrl,
      text: text.trim(),
    });

    setText("");
  };

  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-4 py-6 text-slate-950 md:px-6 md:py-10">
        <section className="flex h-[78vh] flex-col overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="border-b bg-white p-5">
            <p className="text-sm font-bold text-slate-600">
              Project Chat
            </p>

            <h1 className="text-2xl font-bold text-slate-950">
              チャット
            </h1>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
            {messages.length === 0 ? (
              <p className="text-sm font-medium text-slate-600">
                まだメッセージはありません。
              </p>
            ) : (
              messages.map((message) => {
                const isMe = message.senderId === uid;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <img
                        src={
                          message.senderIconUrl ||
                          "https://placehold.jp/150x150.png"
                        }
                        alt="アイコン"
                        className="h-9 w-9 rounded-full border bg-white object-cover"
                      />
                    )}

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isMe
                          ? "bg-slate-950 text-white"
                          : "bg-white text-slate-800"
                      }`}
                    >
                      {!isMe && (
                        <p className="mb-1 text-xs font-bold text-slate-500">
                          {message.senderName}
                        </p>
                      )}

                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="メッセージを入力"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />

              <button
                onClick={handleSend}
                className="rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white"
              >
                送信
              </button>
            </div>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}