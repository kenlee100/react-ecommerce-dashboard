import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <>
      <div className="container">
        <div className="d-flex flex-column  justify-content-center align-items-center h-100 min-vh-100">
          <h1 className="fs-1">404</h1>
          <p className="fs-5">
            喔不！這裡什麼都沒有。
            <br />
            請確認您的網址是否正確
          </p>
          <div className="py-4 text-center">
            <Link className="btn btn-outline-primary" to="/">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
