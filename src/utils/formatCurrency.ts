export function formatCurrency(amount: number){

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount)

      return formatted
}