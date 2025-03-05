/**
 * Columbus API 토큰 검증 스크립트
 * 페이지 로드 시 자동으로 실행되어 토큰을 확인하고 검증합니다.
 */
(function (window) {
  const tokenCookieName = "columbus_api_token";

  /**
   * 쿠키에서 특정 이름의 값을 가져오는 함수
   * @param {string} name - 쿠키 이름
   * @return {string|null} - 쿠키 값 또는 없을 경우 null
   */
  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  /**
   * 토큰을 검증하는 함수
   * @param {string} token - 검증할 토큰
   * @return {Promise<boolean>} - 검증 결과를 반환하는 Promise
   */
  async function verifyToken(token) {
    try {
      const response = await fetch(
        "https://dev.clmbsbcknd.shop/columbus-api/test/token/verify",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.message === "success";
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      return false;
    }
  }

  /**
   * 토큰을 확인하고 검증하는 주요 함수
   */
  async function checkAndVerifyToken() {
    // 쿠키에서 토큰 가져오기
    const token = getCookie(tokenCookieName);

    // 토큰이 없는 경우 실행 중지
    if (!token) {
      console.log("쿠키에 토큰이 없습니다. 검증을 건너뜁니다.");
      return;
    }

    // 토큰 검증
    const isValid = await verifyToken(token);

    // 검증 결과에 따라 메시지 표시
    if (isValid) {
      alert("콜럼버스를 활용해서 실행");
    } else {
      alert("구매한거");
    }
  }

  // DOM이 로드된 후 자동으로 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      checkAndVerifyToken();
    });
  } else {
    // DOM이 이미 로드되었다면 바로 실행
    checkAndVerifyToken();
  }
})(window);
