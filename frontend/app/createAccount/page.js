export default function CreateAccountPage() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-2">
      <label className="border p-2 rounded-xl flex items-center gap-2">
        <input type="text" fill="currentColor" placeholder="Username" />
      </label>
      <label className="border p-2 rounded-xl  flex items-center gap-2">
        <input type="password" placeholder="Password" />
      </label>
      <button className="border p-2 rounded-lg">Create Account</button>
    </div>
  );
}
