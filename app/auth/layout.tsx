const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] to-lime-950 from-lime-700">
      {children}
    </main>
  )
}

export default AuthLayout
