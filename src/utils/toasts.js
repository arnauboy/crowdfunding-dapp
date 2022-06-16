import {toast } from 'react-toastify';

export const successDonationToast = () => {
    toast.success("Succesfully donated!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const failedDonationToast = () => {
    toast.error("Failed to donate",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successFav = () => {
    toast.success("Succesfully added to fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successUnfav = () => {
    toast.success("Succesfully removed from fav list!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successComment = () => {
    toast.success("Succesfully commented!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const failedUnfav = () => {
    toast.error("Failed removing from fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const failedFav = () => {
    toast.error("Failed adding to fav list",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const failedComment = () => {
    toast.error("Failed to comment. User must have a username",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successToast = () => {
    toast.success("Succesfully signed in!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successBuyToast = () => {
    toast.success("Succesfully bought!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const successWithdrawToast = () => {
    toast.success("Succesfully withdrawn!",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };

export const failedBuyToast = () => {
    toast.error("Failed to buy",{ autoClose: 5000, position: toast.POSITION.TOP_RIGHT, toastId: "123"})
  };
