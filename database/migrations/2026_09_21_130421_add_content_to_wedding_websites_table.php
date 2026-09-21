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
        Schema::table('wedding_websites', function (Blueprint $table) {
            $table->string('timezone')->default('Asia/Jakarta');
            $table->jsonb('content')->nullable();
            $table->jsonb('media')->nullable();
            $table->boolean('rsvp_enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_websites', function (Blueprint $table) {
            $table->dropColumn(['timezone', 'content', 'media', 'rsvp_enabled']);
        });
    }
};
