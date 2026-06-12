"use client";

import { useRouter } from "next/navigation";
import AdminNav from "../AdminNav";
import { setMessageRead, deleteMessage } from "./actions";

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function MessagesView({
  email,
  messages,
}: {
  email: string;
  messages: Message[];
}) {
  const router = useRouter();
  const unread = messages.filter((m) => !m.read).length;

  async function toggleRead(m: Message) {
    await setMessageRead(m.id, !m.read);
    router.refresh();
  }

  async function remove(m: Message) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    await deleteMessage(m.id);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#faf6ed] text-[#4a2c0a]">
      <AdminNav email={email} subtitle="Messages" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-bold mb-6">
          Messages
          {unread > 0 && (
            <span className="ml-3 text-sm align-middle bg-[#c49335] text-white px-2 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </h1>

        {messages.length === 0 ? (
          <div className="bg-white border border-[#e8d8c0] rounded-xl p-12 text-center text-[#6e4218]">
            No messages yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`bg-white border rounded-xl p-5 ${
                  m.read ? "border-[#e8d8c0]" : "border-[#c49335]/50 bg-[#fffdf8]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#4a2c0a]">
                      {!m.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-[#c49335] mr-2 align-middle" />
                      )}
                      {m.name}
                    </p>
                    <a
                      href={`mailto:${m.email}?subject=Re: your message to Jerry's Warehouse`}
                      className="text-sm text-[#c49335] hover:underline"
                    >
                      {m.email}
                    </a>
                  </div>
                  <span
                    suppressHydrationWarning
                    className="text-xs text-[#9a6840] whitespace-nowrap"
                  >
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-[#6e4218] leading-relaxed mt-3 whitespace-pre-line">
                  {m.message}
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <a
                    href={`mailto:${m.email}?subject=Re: your message to Jerry's Warehouse`}
                    className="font-medium text-[#6e4218] hover:text-[#c49335]"
                  >
                    Reply
                  </a>
                  <button onClick={() => toggleRead(m)} className="text-[#6e4218] hover:text-[#c49335]">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button onClick={() => remove(m)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
