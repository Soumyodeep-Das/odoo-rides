import { useState } from 'react'
import { MapPin, Clock, Users, Zap } from 'lucide-react'
import type { Ride } from '../types'
import { useAuth } from '#core/hooks/useAuth'
import { useBookRide, useMyBookings, useCancelBooking } from '#modules/booking/hooks'
import { cn } from '#lib/utils'
import { useNavigate } from 'react-router-dom'
import client from '#core/api/client'
import { Modal } from '#components/shared/Modal'
import { CheckCircle2, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RideCardProps {
  ride: Ride
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function RideCard({ ride }: RideCardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutate: book, isPending } = useBookRide()
  const { data: myBookings } = useMyBookings()
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking()
  const [seats, setSeats] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CASH' | 'CARD' | 'UPI'>('CASH')
  const [booked, setBooked] = useState(false)
  const [modalState, setModalState] = useState<{ open: boolean, title: string, message: string, type: 'success' | 'error', action?: { label: string, onClick: () => void } }>({ open: false, title: '', message: '', type: 'success' })

  const showModal = (title: string, message: string, type: 'success' | 'error' = 'success', action?: { label: string, onClick: () => void }) => {
    setModalState({ open: true, title, message, type, action })
  }
  const closeModal = () => setModalState(prev => ({ ...prev, open: false }))

  const handleCancel = () => {
    if (!existingBooking) return
    cancelBooking(
      { rideId: ride.id, bookingId: existingBooking.id },
      {
        onSuccess: () => {
          setBooked(false)
          showModal('Booking Cancelled', 'Your booking was cancelled successfully. Any applicable amount has been refunded to your wallet.', 'success')
        },
        onError: (err: any) => {
          showModal('Cancellation Failed', err?.response?.data?.error || err.message || 'Failed to cancel booking', 'error')
        }
      }
    )
  }

  const existingBooking = myBookings?.find(
    (b) => (b.rideId === ride.id || (b as any).ride?.id === ride.id) && b.status !== 'CANCELLED'
  )
  const isAlreadyBooked = booked || !!existingBooking

  const isOwnRide = user?.id === ride.driverId
  const isScheduled = ride.status === 'SCHEDULED'
  const canBook = isScheduled && !isOwnRide && ride.availableSeats > 0 && !isAlreadyBooked

  const handleBook = () => {
    if (!user) return
    book(
      {
        rideId: ride.id,
        seats,
        paymentMethod,
      },
      {
        onSuccess: (data: any) => {
          if (data?.razorpayOrder) {
            const rzp = new window.Razorpay({
              key: data.razorpayOrder.keyId,
              order_id: data.razorpayOrder.orderId,
              amount: data.razorpayOrder.amount,
              currency: data.razorpayOrder.currency,
              name: 'Odoo Rides',
              description: 'Ride Booking Payment',
              handler: async (response: any) => {
                try {
                  await client.post(`/rides/${ride.id}/bookings/${data.booking.id}/verify`, response)
                  setBooked(true)
                  showModal('Payment Successful', 'Your ride has been booked and confirmed.', 'success')
                } catch (err) {
                  showModal('Payment Verification Failed', 'We could not verify your payment. Please contact support.', 'error')
                }
              }
            })
            rzp.on('payment.failed', () => {
              showModal('Payment Failed', 'Your payment failed or was cancelled.', 'error')
            })
            rzp.open()
          } else {
            setBooked(true)
          }
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || err.message || ''
          if (msg.includes('Insufficient wallet balance')) {
            showModal('Insufficient Balance', msg, 'error', {
              label: 'Recharge Wallet',
              onClick: () => navigate('/recharge')
            })
          } else {
            showModal('Booking Failed', msg || 'An error occurred while booking the ride.', 'error')
          }
        }
      }
    )
  }

  return (
    <article
      className={cn(
        'rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5',
        booked && 'border-green-500/30 bg-green-500/5'
      )}
    >
      {/* Header: status + driver */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
            ride.status === 'SCHEDULED' && 'bg-primary/10 text-primary',
            ride.status === 'ACTIVE' && 'bg-green-500/10 text-green-600',
            ride.status === 'COMPLETED' && 'bg-muted text-muted-foreground',
            ride.status === 'CANCELED' && 'bg-destructive/10 text-destructive'
          )}
        >
          {ride.status === 'SCHEDULED' ? 'Available' : ride.status}
        </span>
        <span className="text-xs text-muted-foreground font-medium truncate">
          by {ride.driver?.name ?? 'Unknown'}
        </span>
      </div>

      {/* Route */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{ride.pickup}</span>
        </div>
        <div className="ml-1.5 border-l border-dashed border-border pl-4 py-0.5">
          <span className="text-[10px] text-muted-foreground font-medium">
            {ride.vehicle ? `${ride.vehicle.make} ${ride.vehicle.carModel} · ${ride.vehicle.color}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{ride.dropoff}</span>
        </div>
      </div>

      {/* Meta: time + seats + price */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(ride.departure)} · {formatTime(ride.departure)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
        </span>
        <span className="ml-auto flex items-center gap-1 font-bold text-primary text-sm">
          <Zap className="w-3.5 h-3.5" />
          ₹{Number(ride.price)}/seat
        </span>
      </div>

      {/* Booking action */}
      {isAlreadyBooked ? (
        <button
          onClick={handleCancel}
          disabled={isCanceling || !existingBooking}
          className="mt-auto w-full rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 disabled:opacity-50 transition-all"
        >
          {isCanceling ? 'Canceling Booking...' : 'Cancel Booking'}
        </button>
      ) : isOwnRide ? (
        <div className="w-full rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground text-center">
          Your ride
        </div>
      ) : (
        <div className="flex gap-2 mt-auto">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            disabled={!canBook}
            className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary/50 appearance-none cursor-pointer w-24 shrink-0"
          >
            <option value="CASH">Cash</option>
            <option value="WALLET">Wallet</option>
            <option value="UPI">UPI</option>
          </select>
          {ride.availableSeats > 1 && (
            <select
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              disabled={!canBook}
              className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary/50 appearance-none cursor-pointer w-24 shrink-0"
            >
              {Array.from({ length: Math.min(ride.availableSeats, 7) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} seat{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleBook}
            disabled={isPending || !canBook}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all"
          >
            {isPending ? 'Booking…' : canBook ? `Book · ₹${Number(ride.price) * seats}` : 'Unavailable'}
          </button>
        </div>
      )}

      <Modal
        open={modalState.open}
        onClose={closeModal}
        size="sm"
      >
        <div className="flex flex-col items-center justify-center pt-2 pb-6 text-center">
          {modalState.type === 'success' ? (
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
          )}
          <h3 className="text-lg font-bold mb-2">{modalState.title}</h3>
          <p className="text-sm text-muted-foreground">{modalState.message}</p>

          {modalState.action ? (
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeModal();
                  modalState.action?.onClick();
                }}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                {modalState.action.label}
              </button>
            </div>
          ) : (
            <button
              onClick={closeModal}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Okay
            </button>
          )}
        </div>
      </Modal>
    </article>
  )
}
