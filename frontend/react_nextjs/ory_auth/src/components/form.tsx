'use client'

export function Form({
    action,
    children,
    userName,
    setUserName,
    password,
    setPassword
}: {
    action: any;
    children: React.ReactNode;
    userName: string,
    setUserName: any,
    password: string,
    setPassword: any
}) {
    return (
        <form
            action={action}
            className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
            <div>
                <label
                    htmlFor="email"
                    className="block text-xs text-gray-600 uppercase"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-xs text-gray-600 uppercase"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>
            {children}
        </form>
    );
}