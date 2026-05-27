import { Schema, model, models, Document } from "mongoose";

//Typescript interface for the Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string; //e.g., "2020-10-03"
    time: string;   //e.g., "09:00 PM"
    mode: string;   //e.g., "Online" or "In-Person"
    audience: string; //e.g., "Developers", "Designers", "Product Managers"
    agenda: string[]; //e.g., ["Keynote", "Workshops", "Networking"]
    organizer: string; //e.g., "Tech Company", "Community Group"
    tags: string[]; //e.g., ["React", "JavaScript", "Web Development"]
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for the Event collection
const eventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        maxlength: [100, "Event title cannot exceed 100 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Event description is required"],
        trim: true,
        maxlength: [1000, "Event description cannot exceed 1000 characters"],
    },
    overview: {
        type: String,
        required: [true, "Event overview is required"],
        trim: true,
        maxlength: [500, "Event overview cannot exceed 500 characters"],
    },
    image: {
        type: String,
        required: [true, "Event image URL is required"],
        trim: true,
    },
    venue: {
        type: String,
        required: [true, "Event venue is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Event location is required"],
        trim: true,
    },
    date: {
        type: String,
        required: [true, "Event date is required"],
    },
    time: {
        type: String,
        required: [true, "Event time is required"],
    },
    mode: {
        type: String,
        required: [true, "Event mode is required"],
        enum: {
            values: ["Online", "Offline", "Hybrid"],
            message: "Event mode must be either Online, Offline, or Hybrid"
        },
    },
    audience: {
        type: String,
        required: [true, "Event audience is required"],
        trim: true,
    },
    agenda: {
        type: [String],
        required: [true, "Event agenda is required"],
        validate: {
            validator: (value: string[]) => value.length > 0,
                message: "Event agenda must have at least one item"
            }
    },
    organizer: {
        type: String,
        required: [true, "Event organizer is required"],
        trim: true,
    },
    tags: {
        type: [String],
        required: [true, "Event tags are required"],
        validate: {
            validator: (value: string[]) => value.length > 0,
                message: "Event tags must have at least one tag"
            },// close validate
        },  // close tags
    },
    {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Pre-save hook for slug generation and data normalization
eventSchema.pre<IEvent>("save", async function () {
    const event = this as IEvent;
    // Generate slug only if title changed or document is new
    if (event.isModified("title") || event.isNew) {
        event.slug = generateSlug(event.title);
    }
    // Normalize date and time formats
    if(event.isModified("date")){
        event.date = normalizeDate(event.date);
    }
    //normalize time format to (HH:MM)
    if(event.isModified("time")){
        event.time = normalizeTime(event.time);
    }

});

// Utility function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace whitespace with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
}

// Utility function to normalize date format to "YYYY-MM-DD"
function normalizeDate(date: string): string {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
    }
    return parsedDate.toISOString().split("T")[0]; // Return only the date part
}

// Utility function to normalize time format to "HH:MM"
function normalizeTime(time: string): string {
    //Handle verios time fomats and convert to 24-hour format(HH:MM)
    const timePattern = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
    const match = time.match(timePattern);

    if (!match) {
        throw new Error("Invalid time format. Expected format: HH:MM AM/PM or HH:MM");
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3]?.toUpperCase();
    
    if (period) {
        if (period === "PM" && hours < 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }
    }

    if (hours < 0 || hours > 23 || parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59) {
        throw new Error("Invalid time value. Hours must be between 0-23 and minutes between 0-59.");
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Create unique index on slug for better performance and data integrity
eventSchema.index({ slug: 1 });

// Create compound index for common query patterns (e.g., date and location)
eventSchema.index({ date: 1, mode: 1 });


// Create and export the Event model
const Event = models.Event || model<IEvent>("Event", eventSchema);
export default Event;
