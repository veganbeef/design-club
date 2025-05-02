"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAccount } from "wagmi";

interface ShippingFormData {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function ShippingAddressForm() {
  const { address } = useAccount();
  const [formData, setFormData] = useState<ShippingFormData>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, create an attestation here
      // Stub: create a dummy attestation with BigInt handling
      const dummyAttestation = JSON.stringify({
        type: "shipping_address",
        timestamp: new Date().toISOString(),
        data: formData,
        // Sample BigInt values that would come from a real attestation
        nonce: BigInt(123456789),
        expirationTime: BigInt(Date.now() + 86400000),
      }, (key, value) => {
        // Convert BigInt values to strings
        return typeof value === 'bigint' 
          ? value.toString() 
          : value;
      });

      const response = await fetch("/api/shipping-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: address,
          attestation: dummyAttestation,
        }, (key, value) => {
          // Convert any BigInt values to strings
          return typeof value === 'bigint' 
            ? value.toString() 
            : value;
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save shipping address");
      }

      setSubmitSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Shipping Address">
      <div className="p-4">
        {submitSuccess ? (
          <div className="text-center py-4">
            <div className="text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Address Saved Successfully!</h3>
            <p className="text-[var(--app-foreground-muted)]">Your shipping address has been securely stored.</p>
            <Button className="mt-4" onClick={() => setSubmitSuccess(false)}>
              Edit Address
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Postal/Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md bg-[var(--app-background-secondary)] border-[var(--app-border)]"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !address}
                className="w-full"
              >
                {isSubmitting ? "Saving..." : "Save Shipping Address"}
              </Button>
              {!address && (
                <p className="text-yellow-500 text-sm text-center mt-2">
                  Connect your wallet to save your address
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
