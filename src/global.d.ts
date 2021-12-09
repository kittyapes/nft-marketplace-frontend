/// <reference types="@sveltejs/kit" />

interface ClaimObject {
  merkleRoot: string;
  user: {
    amount: string;
    index: number;
    proof: string[];
    address: string;
    hasClaimed: boolean;
  }
}