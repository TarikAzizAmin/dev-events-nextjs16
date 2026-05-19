import {Schema, model, models, Document, Types} from "mongoose";
import Event from "./event.model";

// TypeScript interface for the Booking document
export interface IBooking extends Document {
    eventId : Types.ObjectId; // Reference to the Event document
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for the Booking collection
const bookingSchema = new Schema<IBooking>(
{
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event ID is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email: string) {
                // RFC 5322 compliant regex for email validation
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: "Please enter a valid email address",
        },
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});


bookingSchema.pre<IBooking>("save", async function () {
    const booking = this as IBooking;
    // Only validate if the eventId is modified or the document is new
    if (booking.isModified("eventId") || booking.isNew) {
        try {
            // Check if the referenced event exists
            const eventExists = await Event.exists({ _id: booking.eventId }).select("_id");
            if (!eventExists) {
                const error = new Error(`Referenced event id ${booking.eventId} does not exist`);
                error.name = "ValidationError";
                throw error;
            }
        } catch (error: unknown) {
            // If it's already a validation error we threw, rethrow it
            if (error instanceof Error && error.name === "ValidationError") {
                throw error;
            }
            // For invalid ObjectId format or similar validation issues, create a ValidationError
            if (error instanceof Error && (error.message.includes("Cast to ObjectId failed") || error.message.includes("ObjectId"))) {
                const validationError = new Error(`Invalid event id ${booking.eventId}`);
                validationError.name = "ValidationError";
                throw validationError;
            }
            // Rethrow unexpected database errors so they aren't masked
            throw error;
        }
    }
});

// Create and export the Booking model
const Booking = models.Booking || model<IBooking>("Booking", bookingSchema);
export default Booking;