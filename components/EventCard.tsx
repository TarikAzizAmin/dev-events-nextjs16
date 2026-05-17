'use client';

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

interface Props{
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({title, image, slug, location, date, time}: Props) => {
    const handleClick = () => {
        posthog.capture("event_card_clicked", {
            event_title: title,
            event_slug: slug,
            event_location: location,
            event_date: date,
        });
    };

    return(
        <Link href={`/event/${slug}`} id="event-card" onClick={handleClick}>
            <Image src={image} alt={title} width={410} height={300} className="poster"/>
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location" height={14} width={14}/>
                <p>{location}</p>

            </div>

            <p className="title">{title}</p>

            <div className="datetime">

            <div className="flex flex-row gap-2">
                <Image src="/icons/calendar.svg" alt="date" height={14} width={14}/>
                <p>{date}</p>

            </div>
            <div className="flex flex-row gap-2">
                <Image src="/icons/clock.svg" alt="time" height={14} width={14}/>
                <p>{time}</p>

            </div>
            </div>
        </Link>
    )
}

export default EventCard;