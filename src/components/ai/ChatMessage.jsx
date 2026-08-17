export default function ChatMessage({ role, text }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--basil)] text-white'
            : 'bg-[var(--cream)] text-[var(--espresso)]'
        }`}
      >
        {text}
      </div>
    </div>
  )
}