/**
 * Columbus API 토큰 관리자
 * 페이지 로드 시 자동으로 실행되어 토큰을 확인하고 필요시 가져옵니다.
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
   * API에서 토큰을 가져와 쿠키에 저장하는 함수
   * 이미 쿠키에 유효한 토큰이 있으면 API 호출을 건너뜀
   */
  async function getAndStoreToken() {
    // 쿠키에 토큰이 이미 존재하는지 확인
    if (getCookie(tokenCookieName)) {
      console.log("쿠키에 이미 토큰이 존재합니다. API 호출을 건너뜁니다.");
      return getCookie(tokenCookieName);
    }

    try {
      // API를 호출하여 새 토큰 가져오기
      const response = await fetch(
        "https://dev.clmbsbcknd.shop/columbus-api/test/token",
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API 요청 실패, 상태 코드: ${response.status}`);
      }

      const token = await response.text();

      // 토큰을 쿠키에 10분 유효기간으로 저장
      const expirationMinutes = 10;
      const expirationDate = new Date();
      expirationDate.setTime(
        expirationDate.getTime() + expirationMinutes * 60 * 1000
      );

      document.cookie = `${tokenCookieName}=${token}; expires=${expirationDate.toUTCString()}; path=/`;

      console.log("새 토큰을 가져와 쿠키에 저장했습니다.");
      return token;
    } catch (error) {
      console.error("토큰 가져오기 오류:", error);
      return null;
    }
  }

  // DOM이 로드된 후 자동으로 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      getAndStoreToken();
    });
  } else {
    // DOM이 이미 로드되었다면 바로 실행
    getAndStoreToken();
  }

  // 외부에서 필요할 경우를 위해 일부 기능 노출
  window.ColumbusToken = {
    // 필요시 수동으로 토큰을 새로 가져올 수 있는 함수
    refresh: getAndStoreToken,
    // 현재 토큰 값을 가져오는 함수
    get: function () {
      return getCookie(tokenCookieName);
    },
  };
})(window);
