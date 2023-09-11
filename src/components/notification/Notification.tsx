import { useEffect, useState } from "react";

export default function Notification() {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    fetch(`api/notification`)
      .then((response) => response.json())
      .then((posts) => {
        setNotification(posts);
      })
      .catch(() => console.log("error"));
  }, []);

  console.log(notification);
  return <div>Notification</div>;
}
