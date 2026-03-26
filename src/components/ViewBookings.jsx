import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase";


function ViewBookings() {

  const [bookings, setBookings] = useState([]);


  const fetchBookings = async () => {

    const snapshot = await getDocs(
      collection(db, "bookings")
    );

    setBookings(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    );

  };


  useEffect(() => {

    fetchBookings();

  }, []);


  const updateStatus = async (id, status) => {

    await updateDoc(doc(db, "bookings", id), {

      status

    });


    fetchBookings();

  };


  return (

    <div className="bg-gray-100 p-6 rounded-xl">

      <h2 className="text-xl font-bold mb-4">

        Booking Requests

      </h2>


      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead>

            <tr className="bg-blue-900 text-white">

              <th className="p-2">Name</th>

              <th className="p-2">Phone</th>

              <th className="p-2">Service</th>

              <th className="p-2">Date</th>

              <th className="p-2">Guests</th>

              <th className="p-2">Status</th>

              <th className="p-2">Update</th>
              <th className="p-2">Nights</th>
<th className="p-2">Total</th>

            </tr>

          </thead>


          <tbody>

            {bookings.map(item => (

              <tr
                key={item.id}
                className="text-center border-b"
              >

                <td className="p-2">

                  {item.name || "-"}

                </td>


                <td className="p-2">

                  {item.phone || "-"}

                </td>


                <td className="p-2">

                  {item.hotelName ||

                   item.serviceName ||

                   "-"}
                   <td className="p-2">
  {item.nights || "-"}
</td>

<td className="p-2 text-green-600 font-bold">
  ${item.totalPrice || "-"}
</td>

                </td>


                <td className="p-2">

                  {item.checkIn ||

                   item.date ||

                   "-"}

                </td>


                <td className="p-2">

                  {item.guests || "-"}

                </td>


                <td className="p-2">

                  <select

                    value={item.status || "New"}

                    onChange={(e) =>
                      updateStatus(
                        item.id,
                        e.target.value
                      )
                    }

                    className="border p-1 rounded"

                  >

                    <option>New</option>

                    <option>Contacted</option>

                    <option>Confirmed</option>

                    <option>Cancelled</option>

                  </select>

                </td>


                <td className="p-2">

                  ✔

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default ViewBookings;