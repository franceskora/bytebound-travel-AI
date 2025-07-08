import { Outlet } from "react-router-dom";


export const Dashboard = () => {


  return (
    <div className="flex h-screen">

      <div className="flex-1 flex flex-col">
      
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {/* Child routes render here */}
          <Outlet />
        </main>
      </div>


    </div>
  );
};

export default Dashboard;