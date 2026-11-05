import PrivateRoute from "@/components/PrivateRoute";

export default function PrivateLayout({ children }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}