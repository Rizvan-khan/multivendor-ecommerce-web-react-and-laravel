<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            // Self-referencing foreign key for Sub & Sub-sub categories
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->decimal('commission_rate', 5, 2)->default(0.00); // e.g., 5.00%
            $table->decimal('tax_rate', 5, 2)->default(0.00);       // e.g., 18.00%
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
