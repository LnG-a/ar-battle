import { Link } from "react-router-dom";
import { ReactComponent as NotFound } from "../../assets/images/NotFound.svg";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found">
      <NotFound style={{ height: "500px", marginBottom: "30px" }} />
      <Link to="/home">Trở lại </Link>
    </div>
  );
}
export default NotFoundPage;
