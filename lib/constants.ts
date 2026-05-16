export type EventItem = {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string; //e.g., "2020-10-03"
    time: string;   //e.g., "09:00 PM"

};


export const events: EventItem[]=[
    {
        title:"Reacr Summit US 2025",
        image: "/images/event1.png",
        slug: "react-summit-us-2025",
        location: "San Francisco, CA, USA",
        date: "2025-11-07",
        time: "03:00 PM"
    },
     {
        title:"KubeCon + CloudeNativeCon Europe 2026",
        image: "/images/event2.png",
        slug: "kubecon-cloudenativecon-europe-2026",
        location: "Vienna, Austria",
        date: "2026-03-22",
        time: "10:00 AM"
    }
]