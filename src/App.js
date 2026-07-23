import React, {useEffect} from 'react'
import Admin from './Routes/Admin'
import Home from './Routes/Home'
import Store from './Routes/Store'
import ProductStore from './Routes/ProductStore'
import Index from './Routes/erp/Index'
import UsersRoute from './Routes/Users/UsersRoute'
import { RoleAccessProvider } from './Context/RoleAccessContext'
import PoTeam from './Routes/PoTeam/PoTeam'
import SuperAdminRoutes from './Routes/SuperAdmin/SuperAdminRoutes'
import PipingRoute from './Routes/Users/PipingRoute'
import ClientRoutes from './Routes/Users/ClientRoute'
import ClientPipingRoutes from './Routes/Users/ClientPipingRoute'
const MaintenancePage = () => {
  useEffect(() => {
    const canvas = document.getElementById("gearCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
 
    let gears = [];
    const gearEmoji = "⚙️";
 
    class Gear {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 24 + 20;
        this.speed = Math.random() * 0.8 + 0.3;
        this.rotate = Math.random() * 360;
        this.alpha = Math.random() * 0.4 + 0.6;
      }
 
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotate * Math.PI) / 180);
        ctx.globalAlpha = this.alpha;
        ctx.font = `${this.size}px serif`;
        ctx.fillText(gearEmoji, -this.size / 2, this.size / 2);
        ctx.restore();
      }
 
      update() {
        this.y -= this.speed;
        this.rotate += 1;
        if (this.y < -50) {
          this.y = canvas.height + Math.random() * 100;
          this.x = Math.random() * canvas.width;
        }
      }
    }
 
    const createGears = () => {
      for (let i = 0; i < 40; i++) gears.push(new Gear());
    };
 
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gears.forEach((g) => {
        g.draw();
        g.update();
      });
      requestAnimationFrame(animate);
    };
 
    createGears();
    animate();
  }, []);
 
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 10s ease infinite",
        overflow: "hidden",
        color: "white",
        textAlign: "center",
        position: "relative",
        padding: "0 20px"
      }}
    >
      <canvas
        id="gearCanvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
 
      <div
        style={{
          zIndex: 2,
          position: "relative",
          top: "30vh",
          animation: "fadeIn 2s ease-out",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "600",
            color: "#60a5fa",
            textShadow: "0 0 8px rgba(96,165,250,0.5)",
            marginBottom: "12px",
          }}
        >
          🚧 Site Under Maintenance
        </h1>
 
        <p style={{ fontSize: "18px", opacity: 0.85 }}>
          We’re improving the system. Please check back soon.
        </p>
 
        <p style={{ marginTop: "18px", opacity: 0.7 }}>
          Thank you for your patience.
        </p>
      </div>
 
      <style>
        {`
          @keyframes fadeIn {
            from {opacity:0; transform:translateY(20px);}
            to {opacity:1; transform:translateY(0);}
          }
 
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};
const App = () => {
    const isMaintenance = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
  const searchParams = new URLSearchParams(window.location.search);
  const devKey = searchParams.get('devkey');

  if (isMaintenance && devKey !== process.env.REACT_APP_DEVELOPER_KEY) {
    return <MaintenancePage />;
  }
  return (

    <>
      <RoleAccessProvider>
        <>
          <Home />
          <Store />
          <ProductStore />
          <Index />
          <UsersRoute />
          <PoTeam />
          <Admin />
          <SuperAdminRoutes />
          <PipingRoute />
          <ClientRoutes />
          <ClientPipingRoutes />
        </>
      </RoleAccessProvider>
    </>
  )
}

export default App