import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

function Home() {
  return (
    <div className={(styles.wrapper, "container")}>
      <Link to="assistant-chat">
        <button>Чат с ассистентом</button>
      </Link>
    </div>
  );
}

export default Home;
