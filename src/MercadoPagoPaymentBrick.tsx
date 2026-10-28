import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";

const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY?.trim() ?? "";
export const hasMercadoPagoPublicKey = Boolean(publicKey);

if (publicKey) {
  initMercadoPago(publicKey, { locale: "pt-BR" });
}

type Props = {
  amount: number;
  email: string;
  onSubmit: (data: IPaymentFormData) => Promise<void>;
  onError: (message: string) => void;
};

export default function MercadoPagoPaymentBrick({ amount, email, onSubmit, onError }: Props) {
  if (!publicKey) {
    return (
      <p className="checkout-error" role="alert">
        O pagamento está indisponível: configure a chave pública do Mercado Pago no ambiente do frontend.
      </p>
    );
  }

  return (
    <Payment
      initialization={{ amount, payer: { email } }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          bankTransfer: "all",
          types: { included: ["creditCard", "bank_transfer"] }
        }
      }}
      onSubmit={onSubmit}
      onError={(error) => onError(error.message)}
    />
  );
}
