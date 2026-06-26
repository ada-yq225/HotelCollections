"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { DEMO_ACCOUNT } from "@/lib/demo-account";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  async function submitCredentials(payload: { email: string; password: string; name?: string }) {
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "操作失败");
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitCredentials(form);
  }

  async function loginWithDemo() {
    setForm({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      name: DEMO_ACCOUNT.name,
    });
    await submitCredentials({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="hc-card p-8">
        <h1 className="text-center font-serif text-3xl">
          {mode === "login" ? "欢迎回来" : "加入 H&C"}
        </h1>
        <p className="mt-2 text-center text-sm text-[#6b7280]">
          {mode === "login" ? "登录你的奢华足迹账户" : "创建账户，开始记录入住"}
        </p>

        {mode === "login" && (
          <div className="mt-6 rounded-xl border border-[#b8956b]/30 bg-[#faf6f0] p-4">
            <div className="flex items-start gap-3">
              <UserCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b8956b]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#1a1a1a]">演示账号</p>
                <p className="mt-1 font-mono text-sm text-[#374151]">
                  {DEMO_ACCOUNT.email}
                </p>
                <p className="font-mono text-sm text-[#374151]">密码：{DEMO_ACCOUNT.password}</p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={loginWithDemo}
                  className="mt-3 rounded-full border border-[#b8956b]/50 bg-white px-4 py-1.5 text-xs font-medium text-[#b8956b] transition hover:border-[#b8956b] hover:bg-[#fffaf5] disabled:opacity-50"
                >
                  {loading ? "登录中..." : "一键演示登录"}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm text-[#6b7280]">昵称</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
                placeholder="你的称呼"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-[#6b7280]">邮箱</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-[#6b7280]">密码</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
              placeholder="至少 6 位"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="hc-btn-primary w-full disabled:opacity-50">
            {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          {mode === "login" ? (
            <>
              还没有账户？{" "}
              <button onClick={() => setMode("register")} className="text-[#b8956b] hover:underline">
                注册
              </button>
            </>
          ) : (
            <>
              已有账户？{" "}
              <button onClick={() => setMode("login")} className="text-[#b8956b] hover:underline">
                登录
              </button>
            </>
          )}
        </p>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-[#6b7280] hover:text-[#1a1a1a]">
          ← 返回首页
        </Link>
      </p>
    </div>
  );
}