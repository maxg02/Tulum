using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DetailsFieldNameFixing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Detail",
                table: "SavingGoals",
                newName: "Details");

            migrationBuilder.RenameColumn(
                name: "Detail",
                table: "FixedIncomes",
                newName: "Details");

            migrationBuilder.RenameColumn(
                name: "Detail",
                table: "BudgetPlans",
                newName: "Details");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Details",
                table: "SavingGoals",
                newName: "Detail");

            migrationBuilder.RenameColumn(
                name: "Details",
                table: "FixedIncomes",
                newName: "Detail");

            migrationBuilder.RenameColumn(
                name: "Details",
                table: "BudgetPlans",
                newName: "Detail");
        }
    }
}
