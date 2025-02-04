import React from 'react';
import { format } from 'date-fns';
import auth from '../../config/authConfig';
import { toast } from 'react-toastify';
import {  useNavigate } from 'react-router-dom';


const BookingModal = ({ treatment, date, setTreatment, refetch }) => {
    const { _id, name, slots } = treatment;
    const navigate = useNavigate();

    //fetch user information
    // const [user, loading, error] = useAuthState(auth);
    
    const formattedDate = format(date, 'PP');

    const handleBooking = event => {
        event.preventDefault();
        const slot = event.target.slot.value;
        console.log(_id, slot,formattedDate);

        const booking = {
            doctorId: _id,
            // treatment: name,
            date: formattedDate,
            slot: slot,
            // price: price,
            patient: auth.user.email,
            patientName: auth.user.name,
            phone: event.target.phone.value,
            userId:auth.user._id
        }

        // console.log(booking);

        fetch('http://localhost:5001/booking', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.success) {
                    navigate('/dashboard');

                    toast(`Appointment is set, ${formattedDate} at ${slot}`)
                } else {
                    toast.error(`You already have an Appointment on ${data.booking?.date} at ${data.booking?.slot}`)
                }
                refetch();
                //to close the modal
                setTreatment(null);
            })


    };

    return (
        <div>
            <input type="checkbox" id="booking-modal" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="booking-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg text-secondary">Booking for: {name}</h3>
                    <form onSubmit={handleBooking} className='grid grid-cols-1 gap-3 justify-items-center mt-2'>
                        <input type="text" disabled value={format(date, 'PP')} className="input input-bordered w-full max-w-xs" />
                        <select name="slot" className="select select-bordered w-full max-w-xs">
                            {
                                slots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)
                            }
                        </select>
                        <input type="text" name="name" disabled value={auth.user?.name || ''} className="input input-bordered w-full max-w-xs" />
                        <input type="email" name="email" disabled value={auth.user?.email} className="input input-bordered w-full max-w-xs" />
                        <input type="text" name="phone" placeholder="Phone Number" className="input input-bordered w-full max-w-xs" />
                        <input type="submit" value="Submit" className="btn btn-secondary w-full max-w-xs" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;