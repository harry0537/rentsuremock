'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { contactFormSchema, ContactFormData } from '@/lib/validations/property';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { showToast } from '@/lib/toast';
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface ContactFormProps {
  propertyId: string;
  propertyTitle: string;
  landlordName: string;
  price: number;
  onSuccess?: () => void;
}

export default function ContactForm({
  propertyId,
  propertyTitle,
  landlordName,
  price,
  onSuccess
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      propertyId,
      name: '',
      email: '',
      phone: '',
      message: `Hi ${landlordName},\n\nI'm interested in your property "${propertyTitle}" listed at $${price.toLocaleString()}/month. I would like to schedule a viewing or get more information.\n\nThank you!`,
      tourDate: '',
      tourTime: '',
      preferredContact: 'email'
    }
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      showToast.success('Message sent successfully! The landlord will contact you soon.');
      form.reset();
      onSuccess?.();
      
    } catch (error) {
      console.error('Contact form error:', error);
      showToast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickMessages = [
    `I'm interested in scheduling a viewing for this property.`,
    `Is this property still available for rent?`,
    `Could you provide more details about the lease terms?`,
    `I'd like to know more about the neighborhood and amenities.`
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Contact Landlord</h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('name')}
            label="Your Name"
            placeholder="John Doe"
            error={errors.name?.message}
            required
          />
          <Input
            {...register('email')}
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email?.message}
            required
          />
        </div>

        <Input
          {...register('phone')}
          type="tel"
          label="Phone Number"
          placeholder="(555) 123-4567"
          error={errors.phone?.message}
          required
        />

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Contact Method
          </label>
          <div className="flex space-x-4">
            {[
              { value: 'email', label: 'Email', icon: EnvelopeIcon },
              { value: 'phone', label: 'Phone', icon: PhoneIcon },
              { value: 'text', label: 'Text', icon: ChatBubbleLeftRightIcon }
            ].map((method) => {
              const IconComponent = method.icon;
              return (
                <label key={method.value} className="flex items-center cursor-pointer">
                  <input
                    {...register('preferredContact')}
                    type="radio"
                    value={method.value}
                    className="sr-only"
                  />
                  <div className={`
                    flex items-center px-4 py-2 rounded-lg border-2 transition-colors
                    ${watch('preferredContact') === method.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                  `}>
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Tour Scheduling */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Schedule a Tour (Optional)</h4>
            <button
              type="button"
              onClick={() => setShowScheduling(!showScheduling)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showScheduling ? 'Hide' : 'Show'} Scheduling
            </button>
          </div>

          {showScheduling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('tourDate')}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    {...register('tourTime')}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="flexible">I'm flexible</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Message Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Message Templates
          </label>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {quickMessages.map((message, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setValue('message', message)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700 transition-colors"
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            {...register('message')}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your message here..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Message...
            </>
          ) : (
            <>
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Send Message
            </>
          )}
        </Button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          Your contact information will only be shared with the property owner and used to respond to your inquiry.
        </p>
      </form>
    </motion.div>
  );
} 