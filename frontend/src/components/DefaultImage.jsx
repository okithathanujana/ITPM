export function DefaultImg() {
    return (
      <div className="relative">
        <img
          className="h-96 w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
          alt="Modern pharmacy interior"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Medi Cart</h1>
            <p className="text-xl text-white">Your Trusted Online Pharmacy</p>
          </div>
        </div>
      </div>
    );
  }