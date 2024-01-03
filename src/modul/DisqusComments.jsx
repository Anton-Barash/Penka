import React, { useEffect } from "react";

const DisqusComments = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://penka.disqus.com/embed.js";
    script.setAttribute("data-timestamp", +new Date());
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div style={{ marginTop: "15rem" }} id="disqus_thread"></div>;
};

export default DisqusComments;
