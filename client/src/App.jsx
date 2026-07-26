import "./App.css"

function App(){
  const handleSsoLogin=()=>{
    alert("SSO Login")
  };
  const handleAdminLogin=()=>{
    alert("Admin Login")
  };
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>ITC <span>Resources</span> Portal</h1>
        <p>Sign in to submit projects, request institute resources and track your progress.</p>

        <button className="sso-btn" onClick={handleSsoLogin}>
          LOGIN WITH SSO
        </button>
        <div className="divider">
          <span>OR</span>
        </div>
        <button className="admin-btn" onClick={handleAdminLogin}>
          ADMIN LOGIN
        </button>
      </section>
    </main>
  )
}

export default App